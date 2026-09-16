```sql

**초기 세팅**
SHOW PARAMETER db_recovery_file_dest

NAME                       TYPE      VALUE
-------------------------- -------- ------------
db_recovery_file_dest      string   /u02/fra
db_recovery_file_dest_size big integer 8G

ALTER SYSTEM SET log_archive_dest_2 = '' SCOPE=BOTH;
System altered.

ALTER SYSTEM SET log_archive_dest_1 = 'LOCATION=/fra' SCOPE=BOTH;
System altered.

ALTER SYSTEM SET db_recovery_file_dest_size = 100M SCOPE=BOTH;
System altered.

SELECT name, space_limit/1024/1024 AS limit_mb,
           space_used/1024/1024 AS used_mb,
           ROUND(space_used/space_limit*100, 1) AS pct
  FROM  v$recovery_file_dest;

NAME                  LIMIT_MB    USED_MB    PCT
------------------- --------- ---------- ------
/u02/fra                  200        150   75.0

실습 9-6을 마친 상태에서 FRA(Fast Recovery Area) 관련 파라미터 설정을 확인합니다.
아카이브 다중 대상을 해제하고 기본 FRA 경로를 사용하도록 단일화 설정한 뒤, 아카이브 공간 고갈 상황을 강제로 재현하기 위해 FRA의 최대 크기를 200MB로 아주 작게 축소하고 현재 사용량을 확인합니다.

**장애 유발**
create table tab1 as select * from dba_objects;
insert into tab1 select * from tab1;
BEGIN
    FOR i IN 1..20 LOOP
      EXECUTE IMMEDIATE 'ALTER SYSTEM SWITCH LOGFILE';
    END LOOP;
  END;
  /
BEGIN
*
ERROR at line 1:
ORA-16038: log 3 sequence# 58 cannot be archived
ORA-19809: limit exceeded for recovery files
ORA-00312: online log 3 thread 1: '/u02/oradata/orcl/redo03.log'

PL/SQL 반복문을 사용하여 강제로 로그 스위치를 6번 연속 발생시킵니다.
축소해둔 FRA 공간이 가득 차면서 오라클이 새로운 아카이브 로그를 디스크에 기록하지 못해 ORA-16038 및 ORA-19809 에러를 뱉으며 로그 스위치 동작이 완전히 막히는 장애 상황을 유발합니다.

**진단**
[oracle@oel7v9 ~]$ sqlplus hr/hr@orcl

SQL*Plus: Release 19.0.0.0.0 - Production on Sun May 11 15:02:18 2025

ERROR:
ORA-00257: Archiver error. Connect AS SYSDBA only until resolved.

[oracle@oel7v9 ~]$ sqlplus / as sysdba

SELECT status FROM v$instance;

STATUS
------------
OPEN

!tail -8 /fra/backup/cold/20260907_100053/alert_orcl.log
ARC3: Archival started
ORA-19809: limit exceeded for recovery files
ORA-19804: cannot reclaim 209715200 bytes disk space from 209715200 limit
ARCH: Archival stopped, error occurred. Will continue retrying
ORACLE Instance orcl - Archival Error
ORA-16038: log 3 sequence# 58 cannot be archived
ORA-19809: limit exceeded for recovery files
ORA-00312: online log 3 thread 1: '/u02/oradata/orcl/redo03.log'

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

   DEST_ID DESTINATION          STATUS  ERROR
---------- -------------------- ------- --------------------------------
         1 USE_DB_RECOVERY_FILE ERROR   ORA-19809: limit exceeded for re
             _DEST                      covery files

SELECT name, space_limit/1024/1024 AS limit_mb,
           space_used/1024/1024 AS used_mb,
           ROUND(space_used/space_limit*100, 1) AS pct
  FROM  v$recovery_file_dest;

NAME                  LIMIT_MB    USED_MB    PCT
------------------- --------- ---------- ------
/u02/fra                  200        200  100.0

SELECT file_type, percent_space_used, number_of_files
  FROM  v$flash_recovery_area_usage WHERE percent_space_used > 0;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

    GROUP#  SEQUENCE# ARC STATUS
---------- ---------- --- ----------------
         1         56 NO  ACTIVE
         3         58 NO  CURRENT
         4         57 NO  ACTIVE

!df -h /u02 | tail -1
/dev/mapper/ol-u02     20G  7.1G   13G  36% /u02

일반 사용자(hr)로 접속을 시도하면 아카이버 에러(ORA-00257)가 발생하며 모든 접근이 거부되어 업무가 전면 마비됨을 확인합니다. 하지만 SYSDBA로는 정상 접속되며 데이터베이스 인스턴스 자체는 OPEN 상태로 살아있음을 파악합니다.
얼럿 로그와 v$archive_dest 뷰를 통해 FRA 공간 부족(ORA-19809)으로 아카이브 저장이 중지되었음을 진단합니다.
v$recovery_file_dest 조회로 FRA 사용률이 100%에 도달한 것을 확인하고, v$log를 조회해 온라인 리두 로그 그룹의 아카이브 상태(ARC)가 모두 NO로 꽉 막혀 순환이 불가능한 상태임을 인지합니다.
운영체제 디스크 공간 자체는 여유가 있으므로, FRA 한도를 늘려주거나 오래된 아카이브 파일을 지워 공간을 확보하는 방향으로 조치 계획을 세웁니다.

**복구 절차**
SHUTDOWN IMMEDIATE
Database closed.
Database dismounted.
ORACLE instance shut down.

STARTUP
ORACLE instance started.
Database mounted.
Database opened.

ALTER SYSTEM SWITCH LOGFILE;
*
ERROR at line 1:
ORA-16038: log 1 sequence# 56 cannot be archived
ORA-19809: limit exceeded for recovery files

[oracle@oel7v9 ~]$ rman target /

RMAN> CROSSCHECK ARCHIVELOG ALL;
Crosschecked 14 objects

RMAN> DELETE NOPROMPT ARCHIVELOG UNTIL SEQUENCE 50;
Deleted 8 objects

RMAN> EXIT

SELECT space_used/1024/1024 AS used_mb,
           ROUND(space_used/space_limit*100, 1) AS pct
  FROM  v$recovery_file_dest;

   USED_MB    PCT
---------- ------
       112   56.0

ALTER SYSTEM ARCHIVE LOG ALL;

System altered.

데이터베이스를 재기동하더라도 물리적 파일 손상이 아닌 공간 부족 문제이므로, 여전히 로그 스위치가 실패하고 장애가 지속됨을 이론적으로 확인합니다(실무에서는 불필요한 재기동 지양).
근본적인 공간 확보를 위해 RMAN에 접속하여 CROSSCHECK 명령으로 아카이브 파일의 상태를 동기화한 후, 백업이 불필요한 과거의 아카이브 로그(50번 시퀀스 이전)를 일괄 삭제하여 FRA 여유 공간을 확보합니다.
충분한 공간이 확보된 것을 딕셔너리 뷰를 통해 확인한 후, 수동으로 ALTER SYSTEM ARCHIVE LOG ALL 명령을 수행하여 밀려있던 아카이브 작업을 한 번에 처리합니다.

**디비 오픈**
SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

    GROUP#  SEQUENCE# ARC STATUS
---------- ---------- --- ----------------
         1         56 YES INACTIVE
         3         58 YES CURRENT
         4         57 YES INACTIVE

데이터파일 손상이 아닌 가용성 장애이므로 별도의 디비 오픈 절차는 없습니다. 
대신 v$log 뷰를 조회하여 ARC 컬럼이 전부 YES로 변경되었음을 확인하여 막혀있던 리두 로그의 순환 구조가 뚫렸고 서비스가 재개될 준비가 되었음을 확인합니다.
```