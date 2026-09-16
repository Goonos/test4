```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48

SHUTDOWN IMMEDIATE
!rm -rf /fra/backup/cold/20260907_100053 && mkdir -p /fra/backup/cold/20260907_100053
!cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260907_100053/
!rm -f /fra/backup/cold/20260907_100053/temp01.dbf
STARTUP

SELECT file#, name, bytes/1024/1024 AS mb FROM v$datafile ORDER BY file#;

     FILE# NAME                                                  MB
---------- ---------------------------------------------- -----
         1 /u02/oradata/orcl/system01.dbf                   900
         2 /u02/oradata/orcl/users02.dbf
         3 /u02/oradata/orcl/sysaux01.dbf                   600
         4 /u02/oradata/orcl/undotbs01.dbf                  300
         5 /u02/oradata/orcl/tbs01.dbf
         7 /u02/oradata/orcl/users01.dbf                    200
         8 /u02/oradata/orcl/users03.dbf
         9 /u02/oradata/orcl/exam_tbs01.dbf
        10 /u02/oradata/orcl/hist01.dbf                      20

SELECT checkpoint_change# FROM v$database;

CHECKPOINT_CHANGE#
------------------
           2405100

CREATE TABLE hr.emp83(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;
INSERT INTO hr.emp83 VALUES (1, 'after cold backup');
COMMIT;
Commit complete.

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

실습 8-2를 마친 상태에서 실습 직전에 전체 데이터파일에 대한 콜드 백업을 새로 받습니다.
데이터파일 목록 및 체크포인트 SCN을 확인하고, 테스트용 테이블(hr.emp83)을 생성해 데이터를 입력하여 커밋합니다.
이후 강제 로그 스위치와 아카이브를 발생시켜 백업 이후 커밋한 변경 사항이 아카이브 로그에 기록되도록 합니다.

**장애 유발**
SHUTDOWN IMMEDIATE
Database closed.
Database dismounted.
ORACLE instance shut down.

!rm -f /u02/oradata/orcl/system01.dbf \
                 /u02/oradata/orcl/sysaux01.dbf \
                 /u02/oradata/orcl/users01.dbf

!ls /u02/oradata/orcl/ *.dbf
/u02/oradata/orcl/exam_tbs01.dbf
/u02/oradata/orcl/hist01.dbf
/u02/oradata/orcl/tbs01.dbf
/u02/oradata/orcl/temp01.dbf
/u02/oradata/orcl/undotbs01.dbf
/u02/oradata/orcl/users02.dbf
/u02/oradata/orcl/users03.dbf

데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)합니다.
운영체제 레벨에서 SYSTEM, SYSAUX, USERS 테이블스페이스의 데이터파일(1, 3, 7번)을 강제로 삭제하여 유실 상황을 유발합니다.
삭제 후 남은 데이터파일들을 확인합니다.

**진단**
STARTUP
ORACLE instance started.
Database mounted.
ORA-01157: cannot identify/lock data file 1 - see DBWR trace file
ORA-01110: data file 1: '/u02/oradata/orcl/system01.dbf'

SELECT status FROM v$instance;

STATUS
------------
MOUNTED

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         1 FILE NOT FOUND                 0
         3 FILE NOT FOUND                 0
         7 FILE NOT FOUND                 0

!ls -l /fra/backup/cold/20260907_100053/ *.dbf

SELECT MIN(sequence#), MAX(sequence#), COUNT(*)
  FROM v$archived_log WHERE status = 'A';

MIN(SEQUENCE#) MAX(SEQUENCE#)   COUNT(*)
-------------- -------------- ----------
            19             26          8

데이터베이스를 시작(STARTUP)하면 SYSTEM 데이터파일이 없으므로 데이터베이스가 오픈되지 못하고 MOUNT 상태에 머뭅니다.
v$recover_file을 조회하여 1, 3, 7번 세 개의 파일이 손상(FILE NOT FOUND)되었음을 확인합니다.
콜드 백업본이 안전하게 존재하는지 점검하고, 복구에 필요한 아카이브 로그가 연속적으로 있는지 확인하여 MOUNT 상태에서의 일괄 완전 복구를 계획합니다.

**복구 절차**
!cp -p /fra/backup/cold/20260907_100053/system01.dbf \
             /fra/backup/cold/20260907_100053/sysaux01.dbf \
             /fra/backup/cold/20260907_100053/users01.dbf /u02/oradata/orcl/

SET AUTORECOVERY ON
RECOVER DATABASE;
Media recovery complete.

유실된 1번, 3번, 7번 데이터파일의 백업본만 원래 경로로 복원합니다. 멀쩡한 파일은 복원 대상에서 제외하여 복구 시간을 단축시킵니다.
자동 복구를 켜고 RECOVER DATABASE 명령을 실행하여, 복구가 필요한 모든 파일에 대해 한 번에 아카이브 로그를 적용해 복구합니다.

**디비 오픈**
ALTER DATABASE OPEN;

Database altered.

미디어 복구가 성공적으로 완료되었으므로 데이터베이스를 오픈합니다.
완전 복구이므로 RESETLOGS 옵션 없이 정상적으로 열립니다.
```