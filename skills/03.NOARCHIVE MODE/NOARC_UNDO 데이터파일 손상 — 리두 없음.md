```sql
CREATE TABLE hr.emp5(id NUMBER) TABLESPACE users;

SYS@orcl> INSERT INTO hr.emp5 VALUES (1);
SYS@orcl> INSERT INTO hr.emp5 VALUES (2);
COMMIT;
SYS@orcl> SELECT COUNT(*) FROM hr.emp5;

  COUNT(*)
----------
         2

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

장애 유발
!rm -f /u02/oradata/orcl/undotbs01.dbf
ALTER SYSTEM FLUSH BUFFER_CACHE;

증상
INSERT INTO hr.emp5 VALUES (3);
ERROR at line 1:
ORA-01116: error in opening database file 4

복구진행
SHUTDOWN ABORT
!cp 백업경로/undotbs01.dbf /u02/oradata/orcl/
STARTUP MOUNT

온라인 리두가 없어서 문제발생
SYS@orcl> SET AUTORECOVERY OFF
SYS@orcl> RECOVER DATABASE;
ORA-00279: change 2361204 generated at 05/10/2025 11:02:41 needed for thread 1

**중요**
일반 테이블스페이스와의 결정적 차이

일반 테이블스페이스(USERS, TBS01 등):
OFFLINE DROP으로 잘라내도 DB가 열립니다. "해당 테이블스페이스를 조회하는 유저만 에러를 맞고, 나머지 시스템은 상관없다"는 논리가 성립하기 때문입니다.

UNDO 테이블스페이스:
특정 테이블이 아니라 DB 전체의 모든 세션과 모든 트랜잭션이 공통으로 사용하는 필수 엔진 부품입니다. 따라서 잘라낸 상태(OFFLINE)로는 DB를 열 수 없습니다.


콜드리커버리 실행

STARTUP
```