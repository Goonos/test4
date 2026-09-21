```sql
**초기 세팅**
SELECT file#, name, bytes/1024/1024 AS mb FROM v$datafile ORDER BY file#;

     FILE# NAME                                                  MB
---------- ---------------------------------------------- -----
         1 /u02/oradata/orcl/system01.dbf                   900
         3 /u02/oradata/orcl/sysaux01.dbf                   600
         4 /u02/oradata/orcl/undotbs01.dbf                  300
         7 /u02/oradata/orcl/users01.dbf                    200
        10 /u02/oradata/orcl/hist01.dbf                      20
        11 /u02/oradata/orcl/tbs01.dbf                       20
        12 /u02/oradata/orcl/tbs02.dbf                       20

SHUTDOWN IMMEDIATE
!rm -rf /fra/backup/cold/20260907_100053 && mkdir -p /fra/backup/cold/20260907_100053
!cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260907_100053/
!rm -f /fra/backup/cold/20260907_100053/temp01.dbf
STARTUP

INSERT INTO hr.emp91 VALUES (3, 'after backup 92');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

실습 9-1을 마친 상태에서 전체 데이터파일의 크기와 경로를 확인합니다.
데이터베이스를 정상 종료한 뒤 모든 데이터파일을 콜드 백업 디렉토리로 백업하고 다시 기동합니다.
테스트용 테이블에 새로운 데이터를 입력하고 커밋한 후, 아카이브를 발생시켜 백업 이후의 변경 사항을 리두 로그에 기록합니다.

**장애 유발**
SHUTDOWN ABORT
ORACLE instance shut down.

!rm -f /u02/oradata/orcl/ *.dbf

데이터베이스 인스턴스를 ABORT로 비정상 종료시킵니다.
데이터파일이 위치한 디스크(/u02)를 전면 사용할 수 없게 되었다고 가정하고 모든 데이터파일을 삭제합니다.
복원할 새 위치로 충분한 여유 공간이 있는 다른 디스크 경로(/fra/oradata/ORCL)를 생성하고 점검합니다.

**진단**
STARTUP MOUNT
ORACLE instance started.
Database mounted.

SELECT COUNT(*) FROM v$recover_file;

  COUNT(*)
----------
         7

ALTER DATABASE OPEN;
ALTER DATABASE OPEN
*
ERROR at line 1:
ORA-01157: cannot identify/lock data file 1 - see DBWR trace file
ORA-01110: data file 1: '/u02/oradata/orcl/system01.dbf'

SELECT MIN(sequence#), MAX(sequence#), COUNT(*),
           MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log WHERE status = 'A';

MIN(SEQUENCE#) MAX(SEQUENCE#)   COUNT(*)   EXPECTED
-------------- -------------- ---------- ----------
            20             39         20         20

!ls -l /fra/backup/cold/20260907_100053/ *.dbf | wc -l
7

데이터베이스를 MOUNT 상태로 기동하고 v$recover_file을 조회하여 7개의 데이터파일 전체에 복구가 필요함을 확인합니다.
오픈을 시도하면 기존 경로의 첫 번째 파일(SYSTEM)을 찾을 수 없다는 ORA-01157 에러가 발생합니다.
v$archived_log에서 보유 중인 아카이브 로그가 단절 없이 연속되어 있고, 7개의 백업본도 모두 안전하게 존재하므로 새 위치 복원 및 RENAME을 통한 완전 복구 계획을 수립합니다.

**복구 절차**
!cp -p /fra/backup/cold/20260907_100053/ *.dbf /fra/oradata/ORCL/

!ls /fra/oradata/ORCL/ *.dbf | wc -l
7

SET AUTORECOVERY ON
RECOVER DATABASE;
ORA-00283: recovery session canceled due to errors
ORA-01110: data file 1: '/u02/oradata/orcl/system01.dbf'
ORA-01157: cannot identify/lock data file 1 - see DBWR trace file

SET LINESIZE 200 PAGESIZE 0 FEEDBACK OFF
SPOOL /fra/backup/cold/20260907_100053/rename.sql
SELECT 'ALTER DATABASE RENAME FILE ''' || name || '''' ||
           ' TO ''' || REPLACE(name, '/u02/oradata/orcl',
           '/fra/oradata/ORCL') || ''';'
  FROM  v$datafile ORDER BY file#;
SPOOL OFF
SET PAGESIZE 50 FEEDBACK ON

!grep -c 'RENAME FILE' /fra/backup/cold/20260907_100053/rename.sql
7

!head -4 /fra/backup/cold/20260907_100053/rename.sql
ALTER DATABASE RENAME FILE '/u02/oradata/orcl/system01.dbf' TO '/fra/oradata/ORCL/system01.dbf';
ALTER DATABASE RENAME FILE '/u02/oradata/orcl/sysaux01.dbf' TO '/fra/oradata/ORCL/sysaux01.dbf';
ALTER DATABASE RENAME FILE '/u02/oradata/orcl/undotbs01.dbf' TO '/fra/oradata/ORCL/undotbs01.dbf';
ALTER DATABASE RENAME FILE '/u02/oradata/orcl/users01.dbf' TO '/fra/oradata/ORCL/users01.dbf';

@/fra/backup/cold/20260907_100053/rename.sql

SELECT file#, name FROM v$datafile ORDER BY file#;

     FILE# NAME
---------- ------------------------------------------
         1 /fra/oradata/ORCL/system01.dbf
         3 /fra/oradata/ORCL/sysaux01.dbf
         4 /fra/oradata/ORCL/undotbs01.dbf
         7 /fra/oradata/ORCL/users01.dbf
        10 /fra/oradata/ORCL/hist01.dbf
        11 /fra/oradata/ORCL/tbs01.dbf
        12 /fra/oradata/ORCL/tbs02.dbf

RECOVER DATABASE;
Media recovery complete.

모든 백업본을 복원할 새 위치(/fra/oradata/ORCL)로 복사합니다.
컨트롤파일 갱신 없이 RECOVER를 시도하면 오라클이 여전히 예전 경로를 찾기 때문에 복구에 실패함을 확인합니다.
파일 개수가 많아 수동 입력 시 오타가 발생할 수 있으므로 REPLACE 함수를 사용하여 일괄 RENAME SQL 스크립트를 동적으로 생성합니다.
생성된 스크립트를 실행하여 컨트롤파일 내의 모든 데이터파일 경로를 새 위치로 일괄 갱신한 것을 확인합니다.
경로가 정상 갱신된 후 다시 RECOVER DATABASE 명령을 내려 7개 파일 전체에 미디어 복구를 수행하여 완료합니다.

**디비 오픈**
ALTER DATABASE OPEN;

모든 데이터파일에 대한 미디어 복구가 성공적으로 끝났으므로 데이터베이스를 정상 오픈합니다.
```