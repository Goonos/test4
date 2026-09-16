```sql
**초기 세팅**
SELECT file#, name, status FROM v$datafile WHERE file# = 4;

     FILE# NAME                                  STATUS
---------- ------------------------------------- -------
         4 /u02/oradata/orcl/undotbs01.dbf       ONLINE

SHOW PARAMETER undo

NAME                  TYPE      VALUE
----------------- --------- ----------
undo_management   string    AUTO
undo_retention    integer   900
undo_tablespace   string    UNDOTBS1

ALTER TABLESPACE undotbs1 BEGIN BACKUP;
!cp -p /u02/oradata/orcl/undotbs01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE undotbs1 END BACKUP;
Tablespace altered.

INSERT INTO hr.emp91 VALUES (4, 'after undo backup');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT COUNT(*) FROM hr.emp91;

  COUNT(*)
----------
         4

실습 9-2를 마친 상태에서 UNDO 테이블스페이스(undotbs1)의 현재 상태와 설정을 확인하고 핫백업을 수행합니다.
테스트용 테이블에 새로운 데이터를 입력한 후 커밋하고 아카이브 로그를 생성하여 핫백업 이후의 변경 사항을 기록합니다.

**장애 유발**
ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/undotbs01.dbf

운영체제 레벨에서 4번 데이터파일(undotbs01.dbf)을 강제로 삭제하여 UNDO 테이블스페이스 유실 상황을 유발합니다.
버퍼 캐시를 비워 변경 사항을 즉각 인지하게 만듭니다.

**진단**
SELECT COUNT(*) FROM hr.employees;

  COUNT(*)
----------
       107

UPDATE hr.employees SET salary = salary + 1 WHERE ROWNUM <= 10;
*
ERROR at line 1:
ORA-01116: error in opening database file 4
ORA-01110: data file 4: '/u02/oradata/orcl/undotbs01.dbf'
ORA-27041: unable to open file

SELECT file#, name, status FROM v$datafile WHERE file# = 4;

     FILE# NAME                                  STATUS
---------- ------------------------------------- -------
         4 /u02/oradata/orcl/undotbs01.dbf       RECOVER

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         4 FILE NOT FOUND                 0

SELECT MIN(sequence#), MAX(sequence#), COUNT(*),
           MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log WHERE status = 'A';

MIN(SEQUENCE#) MAX(SEQUENCE#)   COUNT(*)   EXPECTED
-------------- -------------- ---------- ----------
            20             42         23         23

단순 조회(SELECT) 작업은 성공하지만 데이터 변경(UPDATE) 등 트랜잭션을 발생시키는 DML 작업은 UNDO 영역을 확보하지 못해 파일 접근 에러(ORA-01116)를 뱉으며 실패합니다.
데이터파일 상태 조회 시 4번 파일이 RECOVER로 변경되었음을 확인합니다.
v$archived_log 뷰를 통해 필요한 아카이브 로그가 연속적으로 보관되어 있음을 점검하고 데이터베이스를 내린 뒤 완전 복구를 수행할 계획을 수립합니다.

**복구 절차**
ALTER TABLESPACE undotbs1 OFFLINE IMMEDIATE;
*
ERROR at line 1:
ORA-30042: Cannot offline the undo tablespace

SHUTDOWN IMMEDIATE
ORA-01116: error in opening database file 4
ORA-01110: data file 4: '/u02/oradata/orcl/undotbs01.dbf'
ORA-01275: Operation SHUTDOWN is not allowed

SHUTDOWN ABORT
ORACLE instance shut down.

STARTUP MOUNT
ORACLE instance started.
Database mounted.

!cp -p /fra/backup/hotbackup/undotbs01.dbf /u02/oradata/orcl/

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         4                          2412400

SET AUTORECOVERY ON
RECOVER DATABASE;
Media recovery complete.

사용 중인 UNDO 테이블스페이스는 강제로 오프라인(OFFLINE IMMEDIATE) 시킬 수 없으며(ORA-30042), 롤백을 수행할 수 없어 정상 종료(SHUTDOWN IMMEDIATE) 시도 또한 에러(ORA-01275)와 함께 거부됨을 확인합니다.
부득이하게 ABORT 모드로 데이터베이스를 강제 종료하고 MOUNT 상태로 기동합니다.
백업된 UNDO 데이터파일을 원본 경로로 복원하고, 비정상 종료(ABORT)로 인해 다른 데이터파일들까지 인스턴스 복구가 필요할 수 있으므로 안전하게 RECOVER DATABASE 명령을 수행하여 일괄적으로 미디어 복구를 수행합니다.

**디비 오픈**
ALTER DATABASE OPEN;

Database altered.

!tail -5 /fra/backup/cold/20260907_100053/alert_orcl.log
Completed redo application of 0.31MB
Completed crash recovery at
SMON: enabling tx recovery
Undo initialization finished serial:0 start:... end:...
Completed: ALTER DATABASE OPEN

데이터베이스 오픈 시, 롤포워드(Redo)를 통해 언두 블록들이 복원된 후 SMON 백그라운드 프로세스가 트랜잭션 복구(Tx recovery)를 수행하는 일련의 과정이 alert log를 통해 정상 완료되었음을 확인합니다.
```