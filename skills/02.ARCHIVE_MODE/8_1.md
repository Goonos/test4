```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48

SELECT name, log_mode, open_mode FROM v$database;

NAME      LOG_MODE     OPEN_MODE
--------- ------------ --------------------
ORCL      ARCHIVELOG   READ WRITE

ARCHIVE LOG LIST
Database log mode              Archive Mode
Automatic archival             Enabled
Archive destination            /u02/arch1
Oldest online log sequence     18
Next log sequence to archive   20
Current log sequence           20

!mkdir -p /fra/backup/hotbackup/

ALTER TABLESPACE users BEGIN BACKUP;
Tablespace altered.

!cp -p /u02/oradata/orcl/users01.dbf /fra/backup/hotbackup/

ALTER TABLESPACE users END BACKUP;
Tablespace altered.

CREATE TABLE hr.emp81 TABLESPACE users
AS SELECT ROWNUM AS id, object_name FROM dba_objects WHERE ROWNUM <= 1000;
Table created.

COMMIT;

SELECT COUNT(*) FROM hr.emp81;

  COUNT(*)
----------
      1000

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT sequence#, status FROM v$archived_log
ORDER BY sequence# DESC FETCH FIRST 3 ROWS ONLY;

 SEQUENCE# S
---------- -
        21 A
        20 A
        19 A

아카이브 로그 모드 상태와 자동 아카이브 여부 등 데이터베이스 정보를 확인합니다.
핫백업 디렉토리를 생성하고 오픈된 상태에서 USERS 테이블스페이스의 데이터파일(users01.dbf)을 백업합니다.
백업 이후 복구 확인용으로 hr.emp81 테이블을 생성해 1000건의 데이터를 삽입하고 커밋합니다.
마지막으로 로그 스위치와 강제 아카이브를 발생시켜 아카이브 로그가 정상적으로 생성되는지 점검합니다.

**장애 유발**
!rm -f /u02/oradata/orcl/users01.dbf

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

운영 중인 USERS 테이블스페이스의 데이터파일(users01.dbf)을 OS 레벨에서 강제로 삭제하여 유실 상황을 유발합니다.
버퍼 캐시를 비워 데이터파일에 대한 물리적 읽기를 유도함으로써 장애 증상이 즉시 나타나도록 합니다.

**진단**
SELECT COUNT(*) FROM hr.emp81;
ERROR at line 1:
ORA-01116: error in opening database file 7
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-27041: unable to open file
Linux-x86_64 Error: 2: No such file or directory

SELECT COUNT(*) FROM hr.employees;

  COUNT(*)
----------
       107

SELECT status FROM v$instance;

STATUS
------------
OPEN

SELECT file#, name, status FROM v$datafile WHERE file# = 7;

     FILE# NAME                                              STATUS
---------- --------------------------------------------- -------
         7 /u02/oradata/orcl/users01.dbf                     RECOVER

SELECT file#, error, change#, time FROM v$recover_file;

     FILE# ERROR                    CHANGE# TIME
---------- -------------------- ----------- ---------
         7 FILE NOT FOUND                 0

!dd if=/fra/backup/hotbackup/users01.dbf bs=1 count=0 2>/dev/null; echo ok
ok

SELECT sequence#, first_change#, next_change# FROM v$log_history
 SEQUENCE# FIRST_CHANGE# NEXT_CHANGE#
---------- ------------- ------------
         1       3998570      4016147
         2       4016147      4016150
         3       4016150      4016154
         4       4016154      4046848
         5       4046848      4048853
         6       4048853      4048857


SELECT sequence#, archived, deleted, status FROM v$archived_log

 SEQUENCE# ARC DEL S
---------- --- --- -
         4 YES NO  A
         5 YES NO  A
         6 YES NO  A


hr.emp81 조회 시 에러가 발생하지만, 다른 테이블이나 인스턴스 상태(OPEN)는 정상적으로 유지되어 다른 업무에 영향을 주지 않음을 확인합니다.
데이터파일 상태 조회 시 파일 7(users01.dbf)이 ARCHIVELOG 모드의 동작으로 인해 자동으로 RECOVER 상태(OFFLINE)로 변경된 것을 알 수 있습니다.
v$recover_file을 통해 손상을 점검하고 정상적인 백업본의 헤더 SCN을 기준으로 복구 시점을 가늠합니다.
복구에 필요한 아카이브 로그 시퀀스가 모두 존재하고 연속적인지 확인하여 미디어 복구가 가능함을 판정합니다.

**복구 절차**
!cp -p /fra/backup/hotbackup/users01.dbf /u02/oradata/orcl/

RECOVER TABLESPACE users;
ORA-00283: recovery session canceled due to errors
ORA-01124: cannot recover data file 7 - file is in use or recovery
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'

ALTER TABLESPACE users OFFLINE NORMAL;
*
ERROR at line 1:
ORA-01191: file 7 is already offline - cannot do a normal offline
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'

ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

**중요** // 나는 IMMEDIATE도 안됨
ALTER TABLESPACE users OFFLINE IMMEDIATE
*
ERROR at line 1:
ORA-00600: internal error code, arguments: [krhpfh_03-1208], [fno =], [7],
[fecpc =], [353], [fhcpc =], [349], [], [], [], [], []
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'

나는  ALTER TABLESPACE users OFFLINE IMMEDIATE; 가 안되서 
ALTER DATABASE DATAFILE 7 OFFLINE;로 하고
!cp -p /fra/backup/hotbackup/users01.dbf /u02/oradata/orcl/
다시 복구하고
RECOVER DATAFILE 7;
리커버리해줌
ORA-00279: change 4044274 generated at 09/08/2026 15:16:02 needed for thread 1
ORA-00289: suggestion : /arch/arch_1_4_1243344001.arc
ORA-00280: change 4044274 for thread 1 is in sequence #4
Log applied.
Media recovery complete.

그제서야 정상처리됨

핫백업 파일(users01.dbf)을 원래 데이터파일 경로로 복원한 뒤 RECOVER 명령을 시도하지만, 대상 파일이 아직 사용 중이거나 복구 중인 상태로 인식되어 에러가 발생합니다.
열린 상태에서 복구하려면 대상을 명확히 OFFLINE으로 내려야 하는데, NORMAL 옵션은 체크포인트를 시도하다 실패하므로 IMMEDIATE 옵션을 사용하여 강제로 상태를 변경합니다.
데이터파일이 완전한 OFFLINE 상태로 전환된 것을 확인한 후, AUTORECOVERY ON을 설정하고 복구를 수행하여 사용자 프롬프트 개입 없이 아카이브 경로를 자동 계산하며 복구를 마칩니다.

**디비 오픈**
ALTER TABLESPACE users ONLINE;
Tablespace altered.

데이터베이스 인스턴스가 한 번도 종료되지 않고 열려 있는(OPEN) 상태이므로, 복구가 완료된 USERS 테이블스페이스를 ONLINE 상태로 전환하여 사용 가능한 상태로 만듭니다.

**DB정상 확인**
SELECT * FROM v$recover_file;

no rows selected

SELECT file#, name, status FROM v$datafile WHERE file# = 7;

     FILE# NAME                                              STATUS
---------- --------------------------------------------- -------
         7 /u02/oradata/orcl/users01.dbf                     ONLINE

SELECT COUNT(*) FROM hr.emp81;

  COUNT(*)
----------
      1000

SELECT resetlogs_change#, resetlogs_time FROM v$database;

RESETLOGS_CHANGE# RESETLOGS_TIME
----------------- ---------------------
                1 08-MAY-25

SELECT status FROM v$instance;

STATUS
------------
OPEN

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT sequence#, status FROM v$archived_log
  ORDER BY sequence# DESC FETCH FIRST 2 ROWS ONLY;

 SEQUENCE# S
---------- -
        23 A
        22 A

!df -h /u02/arch1
Filesystem            Size  Used Avail Use% Mounted on
/dev/mapper/ol-u02     20G  3.4G   17G  17% /u02

v$recover_file을 조회하여 더 이상 복구가 필요한 파일이 없음을 확인하고 데이터파일이 정상적으로 ONLINE 상태인지 점검합니다.
테이블(hr.emp81)을 조회하여 백업 이후 커밋했던 1000건의 데이터가 모두 살아있는지 무중단 완전 복구 성공을 검증합니다.
인스턴스를 한 번도 내리지 않고 복구를 진행했기 때문에 인카네이션(RESETLOGS 이력)이 올라가지 않은 채 데이터베이스는 OPEN 상태를 유지합니다.
마지막으로 로그 스위치를 발생시켜 아카이브가 정상적으로 이어서 생성되는지 확인하고 여유 공간을 점검합니다.

**특이사항 정리**
실습 흐름이 완전히 달라지게 된 근본적인 이유는 USERS 테이블스페이스를 구성하는 데이터파일의 개수 차이 때문이었습니다.

이 하나의 차이가 나비효과가 되어 치명적 오류(ORA-00600)까지 이어졌습니다. 단계별로 원인을 요약해 드립니다.

1. 데이터 저장 위치의 차이 (근본 원인)

교재 환경: USERS 테이블스페이스에 데이터파일이 users01.dbf 딱 1개뿐입니다. 따라서 새로 만든 hr.emp81 테이블도 무조건 여기에 저장됩니다.

질문자님 환경: 이전 실습들의 영향으로 USERS 테이블스페이스에 데이터파일이 3개(users01.dbf, users02.dbf, users03.dbf)나 있었습니다. 오라클은 여유 공간이 있던 8번 파일(users03.dbf)에 hr.emp81 테이블을 저장했습니다.

2. 장애 인지 여부 (증상 다름)

교재 흐름: users01.dbf를 지우고 hr.emp81을 조회하면, 당장 읽어야 할 파일이 없으므로 오라클이 즉시 에러를 내며 파일을 RECOVER(오프라인) 상태로 바꿔버립니다.

질문자님 흐름: 7번 파일(users01.dbf)을 지웠지만, hr.emp81은 8번 파일에 있었기 때문에 조회 시 아무 문제가 없었습니다. 에러가 나지 않았으니 오라클은 7번 파일이 OS에서 지워졌다는 사실을 전혀 눈치채지 못했고, 상태를 계속 ONLINE으로 유지했습니다.

3. 치명적 실수 유발 (ORA-00600 폭발)

교재 흐름: 이미 파일이 OFFLINE으로 떨어져 있으므로 백업본을 덮어씌워도 오라클이 충돌을 일으키지 않습니다.

질문자님 흐름: 파일이 여전히 ONLINE인 상태에서 OS 명령어로 과거의 백업본을 덮어씌웠습니다. 오라클 입장에서는 멀쩡히 운영 중이던 최신 파일이 갑자기 과거 시점의 파일로 둔갑해버린 것입니다. 이를 뒤늦게 깨달은 오라클 백그라운드 프로세스가 파일 헤더의 체크포인트 불일치를 발견하고 패닉(ORA-00600)에 빠져 세션을 끊어버렸습니다.
```