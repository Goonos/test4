```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48
COL tablespace_name FOR a16

CREATE TABLESPACE hist
  DATAFILE '/u02/oradata/orcl/hist01.dbf' SIZE 20M;
Tablespace created.

CREATE TABLE hr.emp_hist TABLESPACE hist
  AS SELECT * FROM hr.employees;
Table created.
COMMIT;

SELECT file#, name, status, checkpoint_change#
  FROM v$datafile WHERE name LIKE '%hist%';

     FILE# NAME                                             STATUS  CHECKPOINT_CHANGE#
---------- ------------------------------------------ ------- ------------------
        10 /u02/oradata/orcl/hist01.dbf               ONLINE             2404020

ALTER TABLESPACE hist BEGIN BACKUP;
!cp -p /u02/oradata/orcl/hist01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE hist END BACKUP;
Tablespace altered.

ALTER TABLESPACE hist OFFLINE NORMAL;
Tablespace altered.

SELECT file#, checkpoint_change#, status FROM v$datafile WHERE file# = 10;

     FILE# CHECKPOINT_CHANGE# STATUS
---------- ------------------ -------
        10            2404160 OFFLINE

SELECT * FROM v$recover_file WHERE file# = 10;

no rows selected

ALTER TABLESPACE hist ONLINE;
ALTER TABLESPACE hist OFFLINE IMMEDIATE;
Tablespace altered.

SELECT file#, error, change# FROM v$recover_file WHERE file# = 10;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
        10                              2404220

RECOVER TABLESPACE hist;
Media recovery complete.

ALTER TABLESPACE hist ONLINE;
Tablespace altered.

실습 8-1을 마친 상태에서 실습용 테이블스페이스(hist)와 데이터파일을 생성하고, 데이터를 삽입한 후 정상적으로 조회되는지 확인합니다.
이후 핫백업 디렉토리로 데이터파일을 백업합니다.
테이블스페이스를 OFFLINE NORMAL로 내리면 체크포인트가 수행되어 복구 대상이 되지 않고, OFFLINE IMMEDIATE로 내리면 체크포인트 없이 내려가 즉시 복구 대상이 되는 차이를 관찰합니다.
차이 확인 후 IMMEDIATE 상태에서 복구를 수행하고 다시 ONLINE 상태로 전환합니다.

**장애 유발**
ALTER TABLESPACE hist OFFLINE NORMAL;
Tablespace altered.

!rm -f /u02/oradata/orcl/hist01.dbf

테이블스페이스를 다시 OFFLINE NORMAL 상태로 내린 뒤, 해당 데이터파일을 OS 명령어(rm)를 사용하여 강제로 삭제함으로써 유실 상황을 유발합니다.

**진단**
SELECT COUNT(*) FROM hr.emp_hist;
ERROR at line 1:
ORA-00376: file 10 cannot be read at this time
ORA-01110: data file 10: '/u02/oradata/orcl/hist01.dbf'

ALTER TABLESPACE hist ONLINE;
*
ERROR at line 1:
ORA-01157: cannot identify/lock data file 10 - see DBWR trace file
ORA-01110: data file 10: '/u02/oradata/orcl/hist01.dbf'

SELECT file#, name, status, checkpoint_change#
  FROM v$datafile WHERE file# = 10;

     FILE# NAME                                             STATUS  CHECKPOINT_CHANGE#
---------- ------------------------------------------ ------- ------------------
        10 /u02/oradata/orcl/hist01.dbf               OFFLINE            2404380

!ls -l /fra/backup/hotbackup/hist01.dbf
-rw-r- - - - -. 1 oracle oinstall 20979712 May 11 10:14 hist01.dbf

OFFLINE 상태이므로 데이터 조회 시 ORA-00376(지금 읽을 수 없음) 오류가 발생하고, ONLINE을 시도하면 파일이 없다는 ORA-01157 오류가 발생합니다.
데이터파일 상태가 이미 OFFLINE이므로 별도로 내리는 단계는 불필요하며, 백업본이 OFFLINE NORMAL 시점보다 이전 것인지 확인하고 아카이브 리두를 통해 그 구간을 메울 수 있음을 판정합니다.

**복구 절차**
!cp -p /fra/backup/hotbackup/hist01.dbf /u02/oradata/orcl/

ALTER TABLESPACE hist ONLINE;
*
ERROR at line 1:
ORA-01113: file 10 needs media recovery
ORA-01110: data file 10: '/u02/oradata/orcl/hist01.dbf'

SELECT file#, error, change# FROM v$recover_file WHERE file# = 10;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
        10                              2404100

SET AUTORECOVERY ON
RECOVER TABLESPACE hist;
Media recovery complete.

SELECT * FROM v$recover_file WHERE file# = 10;

no rows selected

백업된 파일을 원래 경로로 복원한 뒤 ONLINE을 시도하지만, 복원한 백업본이 OFFLINE NORMAL 시점보다 이전 것이라 미디어 복구가 필요하다는 에러(ORA-01113)가 발생합니다.
컨트롤파일이 기대하는 SCN과 복원한 파일 헤더의 SCN 차이를 메우기 위해 자동 복구(AUTORECOVERY ON)를 켜고 RECOVER 명령을 실행하여 복구를 완료합니다.

**디비 오픈**
ALTER TABLESPACE hist ONLINE;

Tablespace altered.

미디어 복구가 정상적으로 완료되어 더 이상 복구할 파일이 없으므로, 테이블스페이스를 ONLINE 상태로 전환합니다.

**DB정상 확인**
SELECT COUNT(*) FROM hr.emp_hist;

  COUNT(*)
----------
       107

SELECT tablespace_name, status FROM dba_tablespaces
  WHERE  tablespace_name = 'HIST';

TABLESPACE_NAME  STATUS
---------------- ---------
HIST             ONLINE

SELECT file#, name, status FROM v$datafile WHERE file# = 10;

     FILE# NAME                                             STATUS
---------- ------------------------------------------ -------
        10 /u02/oradata/orcl/hist01.dbf               ONLINE

ALTER TABLESPACE hist OFFLINE NORMAL;
!cp -p /u02/oradata/orcl/hist01.dbf \
                 /fra/backup/hotbackup/hist01_after_offline.dbf
!rm -f /u02/oradata/orcl/hist01.dbf
!cp -p /fra/backup/hotbackup/hist01_after_offline.dbf \
                 /u02/oradata/orcl/hist01.dbf

SELECT * FROM v$recover_file WHERE file# = 10;

no rows selected

ALTER TABLESPACE hist ONLINE;

Tablespace altered.

SELECT resetlogs_change# FROM v$database;

RESETLOGS_CHANGE#
-----------------
                1

테이블을 조회하여 데이터가 유실되지 않았음을 검증하고, 테이블스페이스와 데이터파일이 정상적인 ONLINE 상태인지 확인합니다.
추가로 OFFLINE NORMAL 상태로 전환된 시점 이후에 받은 백업본을 사용하여 복원 테스트를 진행해 봅니다. 이 경우 파일의 헤더 SCN이 이미 일치하기 때문에 RECOVER 과정 없이 즉시 ONLINE 되는 것을 확인할 수 있습니다.
최종적으로 리셋로그 이력이 증가하지 않았음을 확인하며 데이터베이스 무중단 완전 복구를 마칩니다.
```