```sql
**초기 세팅**
SELECT name, log_mode FROM v$database;

NAME      LOG_MODE
--------- ------------
ORCL      ARCHIVELOG

SELECT COUNT(*) AS files, ROUND(SUM(bytes)/1024/1024/1024, 2) AS gb
  FROM  v$datafile;

     FILES     GB
---------- ------
         7   2.05

CREATE TABLE hr.emp91(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;
INSERT INTO hr.emp91 VALUES (1, 'after cold backup');
COMMIT;

ALTER SYSTEM SWITCH LOGFILE;
INSERT INTO hr.emp91 VALUES (2, 'second');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT sequence#, status FROM v$archived_log
  ORDER BY sequence# DESC FETCH FIRST 3 ROWS ONLY;

 SEQUENCE# S
---------- -
        36 A
        35 A
        34 A

데이터베이스가 ARCHIVELOG 모드인지 확인하고, 정상 종료 후 모든 데이터파일을 백업 경로로 전체 콜드 백업합니다.
백업 완료 후 데이터베이스를 다시 시작하여 현재 데이터파일의 개수와 총 용량을 확인합니다.
테스트용 테이블을 생성해 1번 데이터를 입력 후 커밋하고, 로그 스위치를 발생시킨 뒤 2번 데이터를 추가로 입력합니다.
강제 아카이브를 수행해 백업 이후 생성 및 커밋한 데이터가 아카이브 로그에 기록되도록 구성합니다.

**장애 유발**
SHUTDOWN ABORT
ORACLE instance shut down.

!rm -f /u02/oradata/orcl/ *.dbf

!ls /u02/oradata/orcl/
control01.ctl  control02.ctl  redo01.log  redo03.log  redo04.log

데이터베이스 인스턴스를 ABORT로 비정상 종료시킵니다.
데이터파일이 위치한 디스크의 전면 장애 상황을 가정하여 운영체제 명령어로 모든 데이터파일을 삭제합니다.
삭제 후 디렉토리를 조회해 컨트롤파일과 리두 로그 등 다른 파일만 살아있고 데이터파일은 하나도 남지 않았음을 확인합니다.

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
         4 FILE NOT FOUND                 0
         7 FILE NOT FOUND                 0
        10 FILE NOT FOUND                 0
        11 FILE NOT FOUND                 0
        12 FILE NOT FOUND                 0

7 rows selected.

!ls -l /fra/backup/cold/20260907_100053/ *.dbf | wc -l
7

SELECT MIN(sequence#) AS oldest, MAX(sequence#) AS newest, COUNT(*) AS cnt,
           MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log WHERE status = 'A';

    OLDEST     NEWEST        CNT   EXPECTED
---------- ---------- ---------- ----------
        20         36         17         17

데이터베이스를 시작(STARTUP)하려 하면 첫 번째 데이터파일(SYSTEM)이 없다는 에러를 뱉으며 인스턴스가 MOUNT 상태에서 멈춥니다.
v$recover_file 뷰를 조회하여 7개의 데이터파일 전체에 FILE NOT FOUND 오류가 발생한 전손 상태임을 파악합니다.
백업 디렉토리에 7개의 복원용 파일이 빠짐없이 잘 존재하는지 확인합니다.
v$archived_log 뷰에서 보유 중인 아카이브 로그 개수(CNT)와 시퀀스 구간의 기대값(EXPECTED)이 일치하는지 비교하여 이빨 빠진 구간 없이 완전 복구가 가능함을 판정합니다.

**복구 절차**
SET AUTORECOVERY ON
RECOVER DATABASE;
ORA-00283: recovery session canceled due to errors
ORA-01110: data file 1: '/u02/oradata/orcl/system01.dbf'
ORA-01157: cannot identify/lock data file 1 - see DBWR trace file

!ls /u02/oradata/orcl/ *.dbf 2>/dev/null

!cp -p /fra/backup/cold/20260907_100053/ *.dbf /u02/oradata/orcl/

!ls /u02/oradata/orcl/ *.dbf | wc -l
7

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         1                          2411200
         3                          2411200
         4                          2411200
         7                          2411200
        10                          2411200
        11                          2411200
        12                          2411200

7 rows selected.

RECOVER DATABASE;
Media recovery complete.

물리적인 대상 파일이 하나도 없는 상태에서 RECOVER를 먼저 시도하면 적용할 타겟이 없어 실패함을 확인합니다.
백업 경로에서 7개의 백업 데이터파일을 전부 원래 운영 경로로 복사하여 복원합니다.
복원 직후 다시 v$recover_file을 확인해 보면, ERROR 컬럼이 빈칸으로 표시되어 파일은 존재하지만 각 파일의 헤더에 리두 적용(복구)이 필요한 상태임을 확인할 수 있습니다.
다시 RECOVER DATABASE 명령을 내려 자동 모드로 7개 파일 전체에 대해 미디어 복구를 수행하여 완료합니다.

**디비 오픈**
ALTER DATABASE OPEN;

모든 데이터파일에 대한 미디어 복구가 온전하게 완료되었으므로, RESETLOGS 옵션 없이 데이터베이스를 정상 오픈합니다.
```