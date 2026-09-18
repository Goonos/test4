```sql
CREATE TABLESPACE tbs2
DATAFILE '/u02/oradata/orcl/tbs02.dbf' SIZE 10M;

CREATE TABLE hr.emp2(id NUMBER) TABLESPACE tbs2;

INSERT INTO hr.emp2 VALUES (1);

COMMIT;

SELECT file#, name, creation_change# FROM v$datafile WHERE file# = 2;


장애 유발 : 리두 소진 후 파일 삭제
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

!rm -f /u02/oradata/orcl/tbs02.dbf
ALTER SYSTEM FLUSH BUFFER_CACHE;
SELECT COUNT(*) FROM hr.emp2;
조회 안됨

ALTER DATABASE CREATE DATAFILE
'/u02/oradata/orcl/tbs01.dbf'
AS '/u02/oradata/orcl/tbs01.dbf';

!ls -l /u02/oradata/orcl/tbs01.dbf

SYS@orcl> SET AUTORECOVERY ON
SYS@orcl> RECOVER DATAFILE 2;

이번엔 해도 온라인 리두가 없어서 리커버가 안된다.

해당 테이블스페이스를 강제로 오프라인 시킨후 올린다.
ALTER DATABASE DATAFILE 2 OFFLINE DROP;
ALTER DATABASE OPEN;
DROP TABLESPACE tbs2 INCLUDING CONTENTS AND DATAFILES;

검증
SELECT COUNT(*) FROM hr.emp2;
조회안됨 / 해당 테이블 스페이스만 날림
SELECT COUNT(*) FROM hr.employees;
다른 테이블 스페이스는 정상
```