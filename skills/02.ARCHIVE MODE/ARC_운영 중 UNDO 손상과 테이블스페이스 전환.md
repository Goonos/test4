```sql
**초기 세팅**
SHOW PARAMETER undo_tablespace

NAME                  TYPE      VALUE
------------------ -------- ----------
undo_tablespace    string   UNDOTBS1

SELECT tablespace_name, COUNT(*) AS segs FROM dba_rollback_segs
  GROUP BY tablespace_name;

TABLESPACE_NAME    SEGS
--------------- -------
SYSTEM                1
UNDOTBS1             10

ALTER TABLESPACE undotbs1 BEGIN BACKUP;
!cp -p /u02/oradata/orcl/undotbs01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE undotbs1 END BACKUP;
Tablespace altered.

CREATE TABLE hr.emp94(id NUMBER) TABLESPACE users;
INSERT INTO hr.emp94 VALUES (1);
COMMIT;
Commit complete.

실습 9-3을 마친 상태에서 현재 사용 중인 UNDO 테이블스페이스(UNDOTBS1) 및 롤백 세그먼트 할당 상태를 확인합니다.
이후 해당 UNDO 데이터파일을 핫백업하고 테스트용 테이블을 생성해 데이터를 입력, 커밋하여 초기 환경을 구성합니다.

**장애 유발**
[oracle@oel7v9 ~]$ sqlplus hr/hr@orcl

HR@orcl> UPDATE employees SET commission_pct = 0.1 WHERE department_id = 80;
34 rows updated.

SYS@orcl> SELECT s.sid, s.username, t.status, t.used_ublk
  FROM  v$transaction t, v$session s WHERE t.ses_addr = s.saddr;

       SID USERNAME   STATUS      USED_UBLK
---------- ---------- ---------- ----------
        41 HR         ACTIVE              6

SYS@orcl> !rm -f /u02/oradata/orcl/undotbs01.dbf

SYS@orcl> ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

별도의 터미널(세션)에서 HR 계정으로 접속해 커밋하지 않은 UPDATE 트랜잭션을 발생시켜 UNDO 블록(언두)을 확보하게 만듭니다.
관리자 세션에서 활성 트랜잭션이 존재함을 확인한 후, 운영체제 레벨에서 UNDO 데이터파일(undotbs01.dbf)을 강제로 삭제하고 버퍼 캐시를 비워 장애를 유발합니다.

**진단**
INSERT INTO hr.emp94 VALUES (2);
*
ERROR at line 1:
ORA-01116: error in opening database file 4
ORA-01110: data file 4: '/u02/oradata/orcl/undotbs01.dbf'
ORA-27041: unable to open file

SELECT COUNT(*) FROM hr.emp94;

  COUNT(*)
----------
         1

SELECT file#, name, status FROM v$datafile WHERE file# = 4;

     FILE# NAME                                  STATUS
---------- ------------------------------------- -------
         4 /u02/oradata/orcl/undotbs01.dbf       RECOVER

SELECT file#, error FROM v$recover_file;

     FILE# ERROR
---------- --------------------
         4 FILE NOT FOUND

!df -h /u02 | tail -1
/dev/mapper/ol-u02     20G  6.1G   14G  31% /u02

데이터 삽입 시 파일 열기 에러(ORA-01116)가 발생하며 변경 작업이 실패하지만, 단순 조회(SELECT)는 정상적으로 수행되어 업무가 부분적으로 마비되었음을 확인합니다.
4번 파일 상태가 RECOVER이고 손상(FILE NOT FOUND)되었음을 확인한 후, 정식 복구 시 데이터베이스 중단이 필요하므로 여유 공간이 있는 디스크(/u02)에 새로운 UNDO 테이블스페이스를 생성하여 서비스를 우회하기로 판정합니다.

**복구 절차**
DROP TABLESPACE undotbs1 INCLUDING CONTENTS AND DATAFILES;
*
ERROR at line 1:
ORA-30013: undo tablespace 'UNDOTBS1' is currently in use

SHOW PARAMETER undo_tablespace

NAME                  TYPE      VALUE
------------------ -------- ----------
undo_tablespace    string   UNDOTBS1

CREATE UNDO TABLESPACE undotbs2
    DATAFILE '/u02/oradata/orcl/undotbs02.dbf' SIZE 300M;
Tablespace created.

ALTER SYSTEM SET undo_tablespace = 'UNDOTBS2' SCOPE=BOTH;
System altered.

SHOW PARAMETER undo_tablespace

NAME                  TYPE      VALUE
------------------ -------- ----------
undo_tablespace    string   UNDOTBS2

INSERT INTO hr.emp94 VALUES (2);
1 row created.
COMMIT;
Commit complete.

손상된 UNDO 테이블스페이스를 바로 삭제하려 시도하면 현재 사용 중(undo_tablespace 파라미터가 지정함)이므로 삭제할 수 없다는 에러(ORA-30013)가 발생합니다.
순서에 맞게 새 UNDO 테이블스페이스(UNDOTBS2)를 먼저 생성하고 파라미터를 변경하여 활성 UNDO 테이블스페이스를 전환합니다.
전환 즉시 재기동 없이 데이터 삽입 및 커밋 등 DML 작업이 정상 처리되어 서비스가 재개됨을 확인합니다.

**디비 오픈 및 정식 복구**
SELECT COUNT(*) FROM hr.emp94;

  COUNT(*)
----------
         2

SELECT segment_name, status FROM dba_rollback_segs
  WHERE  tablespace_name = 'UNDOTBS1' AND status <> 'OFFLINE'
  FETCH FIRST 3 ROWS ONLY;

SEGMENT_NAME               STATUS
-------------------------- ----------------
_SYSSMU3_2421748942$       PARTLY AVAILABLE

SELECT s.sid, s.username, t.status FROM v$transaction t, v$session s
  WHERE  t.ses_addr = s.saddr;

       SID USERNAME   STATUS
---------- ---------- ----------
        41 HR         ACTIVE

HR@orcl> ROLLBACK;
*
ERROR at line 1:
ORA-00376: file 4 cannot be read at this time
ORA-01110: data file 4: '/u02/oradata/orcl/undotbs01.dbf'

SYS@orcl> SHUTDOWN ABORT
SYS@orcl> STARTUP MOUNT

SYS@orcl> !cp -p /fra/backup/hotbackup/undotbs01.dbf /u02/oradata/orcl/

SYS@orcl> SET AUTORECOVERY ON
SYS@orcl> RECOVER DATABASE;
Media recovery complete.

SYS@orcl> ALTER DATABASE OPEN;
Database altered.

기존에 발생시켜 둔 HR 세션의 활성 트랜잭션 때문에 이전 UNDO의 세그먼트가 PARTLY AVAILABLE 상태로 남아 완전히 정리되지 않았음을 확인합니다.
HR 세션에서 롤백을 시도하지만 이전 UNDO 데이터파일이 손상된 상태라 롤백 데이터를 읽지 못해 실패(ORA-00376)함을 관찰합니다. 즉, 응급 우회가 새 트랜잭션은 살리지만 기존 활성 트랜잭션까지 구제해 주지는 못함을 배웁니다.
이 문제를 해결하기 위해 (유지보수 시간을 잡아) 데이터베이스를 ABORT 모드로 종료 후 MOUNT 기동하여 원래 UNDO 파일을 백업본으로 복원하고 미디어 복구를 수행한 뒤 데이터베이스를 오픈합니다.
```