```sql
CREATE TABLESPACE tbsrc
DATAFILE '/u02/oradata/orcl/tbs01.dbf' SIZE 10M;

CREATE TABLE hr.emp1(id NUMBER, name VARCHAR2(30)) TABLESPACE tbsrc

INSERT INTO hr.emp1 VALUES (1, 'KIM');

INSERT INTO hr.emp1 VALUES (2, 'LEE');

COMMIT;

SELECT COUNT(*) FROM hr.emp1;

SELECT file#, name FROM v$datafile WHERE file# = 5

장애 유발
!rm -f /u02/oradata/orcl/tbs01.dbf
ALTER SYSTEM FLUSH BUFFER_CACHE;

복구 시작
SHUTDOWN ABORT

STARTUP MOUNT

ALTER DATABASE CREATE DATAFILE
'/u02/oradata/orcl/tbs01.dbf'
AS '/u02/oradata/orcl/tbs01.dbf';

!ls -l /u02/oradata/orcl/tbs01.dbf

SYS@orcl> SET AUTORECOVERY ON
SYS@orcl> RECOVER DATAFILE 8;
Media recovery complete.

SYS@orcl> ALTER DATABASE OPEN;

정상확인
SELECT * FROM hr.emp1 ORDER BY id;
```