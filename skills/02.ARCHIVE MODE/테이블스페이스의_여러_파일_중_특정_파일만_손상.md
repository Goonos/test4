```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48
COL segment_name FOR a16

ALTER TABLESPACE users ADD DATAFILE
  '/u02/oradata/orcl/users04.dbf' SIZE 100M;
Tablespace altered.

SELECT file#, name, bytes/1024/1024 AS mb FROM v$datafile
  WHERE  name LIKE '%users%' ORDER BY file#;

     FILE# NAME                                                  MB
---------- ---------------------------------------------- -----
         2 /u02/oradata/orcl/users02.dbf
         7 /u02/oradata/orcl/users01.dbf                    200
         8 /u02/oradata/orcl/users03.dbf
        13 /u02/oradata/orcl/users04.dbf                    100

ALTER TABLE hr.emp81 ALLOCATE EXTENT (DATAFILE
  '/u02/oradata/orcl/users04.dbf' SIZE 8M);
Table altered.

CREATE TABLE hr.emp87 TABLESPACE users
  AS SELECT ROWNUM AS id, object_name FROM dba_objects WHERE ROWNUM <= 2000;
Table created.
COMMIT;

SELECT DISTINCT file_id, segment_name FROM dba_extents
  WHERE  tablespace_name = 'USERS' ORDER BY file_id, segment_name;

   FILE_ID SEGMENT_NAME
---------- ----------------
         7 EMP81
         7 EMP83
        13 EMP81
        13 EMP87

ALTER TABLESPACE users BEGIN BACKUP;
!cp -p /u02/oradata/orcl/users01.dbf \
                 /u02/oradata/orcl/users04.dbf /fra/backup/hotbackup/
ALTER TABLESPACE users END BACKUP;
Tablespace altered.

INSERT INTO hr.emp87 VALUES (9999, 'AFTER BACKUP');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

실습 8-6을 마친 상태에서 사용자의 기존 파일(users02.dbf)과 충돌을 피하기 위해 USERS 테이블스페이스에 13번 데이터파일(users04.dbf)을 새로 추가합니다.
새 파일에 세그먼트가 할당되도록 기존 테이블(hr.emp81)에 익스텐트를 강제 할당하고, 새 테이블(hr.emp87)을 생성하여 데이터를 삽입합니다.
조회를 통해 emp81은 여러 파일에 걸쳐 있고, emp87은 13번 파일에만 존재함을 확인합니다.
이후 핫백업을 수행하고 추가 데이터를 입력하여 아카이브 로그를 생성합니다.

**장애 유발**

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/users04.dbf

테이블스페이스를 구성하는 여러 개의 데이터파일 중 13번 파일(users04.dbf) 하나만 운영체제 레벨에서 삭제합니다.
버퍼 캐시를 비워 오라클이 물리적 디스크 읽기를 시도하게 하여 장애를 즉각적으로 발생시킵니다.

**진단**
SELECT COUNT(*) FROM hr.emp87;
ERROR at line 1:
ORA-01116: error in opening database file 13
ORA-01110: data file 13: '/u02/oradata/orcl/users04.dbf'
ORA-27041: unable to open file

SELECT COUNT(*) FROM hr.emp83;

  COUNT(*)
----------
         2

SELECT COUNT(*) FROM hr.emp81;
ERROR at line 1:
ORA-01116: error in opening database file 13
ORA-01110: data file 13: '/u02/oradata/orcl/users04.dbf'

SELECT file#, name, status FROM v$datafile
  WHERE  name LIKE '%users%' ORDER BY file#;

     FILE# NAME                                              STATUS
---------- --------------------------------------------- -------
         2 /u02/oradata/orcl/users02.dbf                     ONLINE
         7 /u02/oradata/orcl/users01.dbf                     ONLINE
         8 /u02/oradata/orcl/users03.dbf                     ONLINE
        13 /u02/oradata/orcl/users04.dbf                     RECOVER

SELECT DISTINCT owner, segment_name, segment_type
  FROM  dba_extents WHERE file_id = 13;

OWNER  SEGMENT_NAME     SEGMENT_TYPE
------ ---------------- ------------
HR     EMP81            TABLE
HR     EMP87            TABLE

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
        13 FILE NOT FOUND                 0

테이블을 조회해 보면 13번 파일에만 있는 emp87 테이블과 두 파일에 걸쳐 있는 emp81 테이블은 ORA-01116 에러로 조회가 실패하지만, 정상 파일에 존재하는 emp83 테이블은 문제없이 조회됩니다.
데이터파일 상태를 확인하여 13번 파일만 RECOVER 상태로 변경되었음을 확인합니다.
dba_extents를 통해 손상된 13번 파일에 포함된 객체가 무엇인지 파악하여 복구 시 영향 범위를 진단합니다.

**복구 절차**
ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

SELECT COUNT(*) FROM hr.emp83;
ERROR at line 1:
ORA-00376: file 7 cannot be read at this time
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'

ALTER TABLESPACE users ONLINE;
Tablespace altered.

ALTER DATABASE DATAFILE 13 OFFLINE;
Database altered.

SELECT COUNT(*) FROM hr.emp83;

  COUNT(*)
----------
         2

!cp -p /fra/backup/hotbackup/users04.dbf /u02/oradata/orcl/

SET AUTORECOVERY ON
RECOVER DATAFILE 13;
Media recovery complete.

테이블스페이스 전체를 OFFLINE IMMEDIATE로 내리게 되면, 멀쩡한 파일(7번 등)까지 접근이 차단되어 정상 서비스되던 emp83 테이블의 조회마저 ORA-00376 에러로 막히게 됩니다.
영향 범위를 최소화하기 위해 테이블스페이스를 다시 ONLINE으로 올린 뒤, 손상된 13번 데이터파일만 개별적으로 OFFLINE 시킵니다.
파일 단위 오프라인 후 정상 파일의 세그먼트(emp83)가 다시 정상적으로 조회되는 것을 확인합니다.
핫백업본(users04.dbf)을 원래 경로로 복원하고, 13번 데이터파일만을 지정하여(RECOVER DATAFILE 13) 미디어 복구를 수행합니다.

**디비 오픈**
ALTER DATABASE DATAFILE 13 ONLINE;

데이터베이스는 이미 오픈 상태이므로, 복구가 완료된 특정 13번 데이터파일만을 ONLINE 상태로 전환하여 해당 파일의 세그먼트 서비스 구동을 재개합니다.
```