```sql
**초기 세팅**
DROP TABLE hr.emp85n PURGE;
Table dropped.

CREATE TABLESPACE tbs02 DATAFILE '/u02/oradata/orcl/tbs022.dbf' SIZE 20M;
Tablespace created.

CREATE TABLE hr.emp86 TABLESPACE tbs02
AS SELECT ROWNUM AS id, object_name FROM dba_objects WHERE ROWNUM <= 500;
Table created.
COMMIT;

SELECT file#, name, creation_change# FROM v$datafile
  WHERE  name LIKE '%tbs022%';

     FILE# NAME                                       CREATION_CHANGE#
---------- ------------------------------------------ ----------------
        11 /u02/oradata/orcl/tbs022.dbf                       2407900

SELECT COUNT(*) FROM hr.emp86;

  COUNT(*)
----------
       500

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

!ls /fra/backup/hotbackup/tbs02.dbf 2>/dev/null

이전 실습의 잔여 테이블을 삭제하고 새로운 테이블스페이스(tbs02)를 생성합니다.
새 테이블스페이스에 500건의 데이터를 가진 테스트 테이블(hr.emp86)을 생성하고 커밋한 뒤, 데이터파일의 생성 SCN을 확인합니다.
강제 로그 스위치를 통해 리두 로그를 아카이브하고, 백업 디렉토리를 조회하여 이 새 데이터파일에 대한 백업본이 전혀 없음을 확인합니다.

**장애 유발**

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/tbs022.dbf


!mkdir -p /u02/oradata/orcl_ro
!chmod 500 /u02/oradata/orcl_ro

백업본이 없는 상태에서 운영체제 명령어로 tbs02.dbf 파일을 강제로 삭제하고 버퍼 캐시를 비워 장애를 유발합니다.
원래 디스크 경로에 문제가 생겨 새 파일을 생성할 수 없는 상황을 가정하기 위해, 쓰기 권한이 없는(chmod 500) 디렉터리(orcl_ro)를 임시로 생성해 둡니다.

**진단**
SELECT COUNT(*) FROM hr.emp86;
ERROR at line 1:
ORA-01116: error in opening database file 12
ORA-01110: data file 12: '/u02/oradata/orcl/tbs02.dbf'
ORA-27041: unable to open file

SELECT file#, status FROM v$datafile WHERE file# = 11;

     FILE# STATUS
---------- -------
        11 RECOVER

SELECT file#, creation_change# FROM v$datafile WHERE file# = 11;

     FILE# CREATION_CHANGE#
---------- ----------------
        11          2407900

SELECT sequence#, status FROM v$archived_log

 SEQUENCE# S
---------- -
        29 A
        30 A
        31 A

테이블을 조회하면 데이터파일 접근 에러(ORA-01116)가 발생하고, 12번 파일의 상태가 RECOVER로 전환된 것을 확인합니다.
데이터파일의 생성 시점 SCN을 조회한 뒤, 그 시점 이후의 아카이브 로그가 모두 연속적으로 보관되어 있음을 확인합니다.
원래 디스크를 쓸 수 없으므로, 여유 공간과 쓰기 권한이 있는 대체 경로(/fra/oradata/ORCL)를 확인하여 새 복구 위치로 선정합니다.

**복구 절차**
ALTER TABLESPACE tbs02 OFFLINE IMMEDIATE;
Tablespace altered.

ALTER DATABASE CREATE DATAFILE 11
  AS '/u02/oradata/orcl_ro/tbs022.dbf';
*
ERROR at line 1:
ORA-01119: error in creating database file
           '/u02/oradata/orcl_ro/tbs02.dbf'
ORA-27040: file create error, unable to create file
Linux-x86_64 Error: 13: Permission denied

!ls -ld /u02/oradata/orcl_ro
dr-x------. 2 oracle oinstall 4096 May 11 11:18 /u02/oradata/orcl_ro

ALTER DATABASE CREATE DATAFILE 11
  AS '/u02/oradata/orcl/tbs022.dbf';
Database altered.

SELECT file#, name, status FROM v$datafile WHERE file# = 11;

     FILE# NAME                                             STATUS
---------- ------------------------------------------ -------
        12 /fra/oradata/ORCL/tbs02.dbf                      RECOVER

SET AUTORECOVERY ON
RECOVER TABLESPACE tbs02;
Media recovery complete.

손상된 테이블스페이스를 OFFLINE IMMEDIATE로 강제 오프라인시킵니다.
쓰기 권한이 없는 디렉터리(orcl_ro)에 파일 생성을 시도하면 권한 에러(ORA-01119, ORA-27040)로 실패함을 확인합니다.
올바른 권한을 가진 대체 경로(/fra/oradata/ORCL)를 AS 절에 지정하여 빈 데이터파일을 새로 생성하면, 컨트롤파일 내부의 경로가 자동으로 갱신됩니다.
이후 AUTORECOVERY ON을 설정하고 RECOVER 명령을 수행해 아카이브 로그를 새 파일에 일괄 적용하여 미디어 복구를 완료합니다.

**디비 오픈**
ALTER TABLESPACE tbs02 ONLINE;

Tablespace altered.

미디어 복구가 정상적으로 완료되었으므로 복구된 테이블스페이스를 ONLINE 상태로 전환합니다.

**DB정상 확인**
SELECT * FROM v$recover_file;

no rows selected

SELECT COUNT(*) FROM hr.emp86;

  COUNT(*)
----------
       500

COL name FOR a52
SELECT 'DATAFILE' AS type, name FROM v$datafile
  UNION ALL SELECT 'TEMPFILE', name FROM v$tempfile
  UNION ALL SELECT 'CONTROL', name FROM v$controlfile
  ORDER BY 1, 2;

SELECT file#, name, status FROM v$datafile WHERE file# = 11;

     FILE# NAME                                             STATUS
---------- ------------------------------------------ -------
        11 /u02/oradata/orcl/tbs02.dbf                      ONLINE

!chmod 700 /u02/oradata/orcl_ro
!rmdir /u02/oradata/orcl_ro

복구할 파일이 남지 않았는지 점검하고, 백업본 없이 다른 디스크 경로에서 데이터가 완전히 복원되었는지 테이블 조회로 확인합니다.
전체 파일 경로를 조회하여 12번 파일만 다른 경로(/fra/oradata/ORCL)에 어긋나게 존재하는 구조적 변화를 확인합니다.
경로 등 데이터베이스 구조가 변경되었으므로 컨트롤파일 백업과 방금 복구한 새 데이터파일의 핫백업을 즉시 수행합니다.
원래 디스크 경로의 문제가 해결되었다고 가정하고 19c 온라인 데이터파일 이동 기능(MOVE DATAFILE)을 사용하여 무중단 상태로 원래 경로로 파일을 원복시킨 후, 임시 경로의 원본 파일이 자동 삭제되었음을 확인하고 테스트용 디렉터리를 정리합니다.
```