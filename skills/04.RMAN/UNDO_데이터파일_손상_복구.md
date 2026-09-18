```sql
-- UNDO 테이블스페이스의 데이터파일이 손상되었다.
-- UNDO는 활성 트랜잭션의 되돌리기 정보를 담고 있어 OFFLINE으로 내릴 수 없다.
-- 전면 중단 후 MOUNT 상태에서 복구한다.
-- 9장의 UNDO 손상 판단이 RMAN에서도 그대로 적용됨을 확인한다.
-- 복구 유형 : 완전 복구, 전면 중단, 손실 없음

**사전 조건**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP DATABASE TAG 'BASE_157' PLUS ARCHIVELOG;
실습을 위한 깨끗한 복구 기준점을 마련하기 위해 전체 데이터베이스와 아카이브 로그 백업을 수행합니다.

**초기 상태 확인**
[세션: SQL*Plus (SYSDBA)]
SHOW PARAMETER undo_tablespace
현재 인스턴스가 사용 중인 UNDO 테이블스페이스의 이름(UNDOTBS1)을 확인합니다.

SELECT file#, name FROM v$datafile WHERE file# = 4;
UNDO 데이터파일이 4번 파일이며, 현재 경로(/fra/oradata/ORCL/undotbs01.dbf)에 있음을 확인합니다. (알려주신 사용자 경로 적용)

CREATE TABLE hr.rec157(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;
INSERT INTO hr.rec157 VALUES (1, 'committed');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
백업 이후의 트랜잭션을 아카이브 로그로 생성합니다.

INSERT INTO hr.rec157 VALUES (2, 'in current redo');
COMMIT;
현재 온라인 리두 로그(CURRENT)에만 존재하는 최신 데이터를 생성합니다.

**장애 유발 : UNDO 데이터파일 삭제**
[세션: SQL*Plus (SYSDBA)]
ALTER SYSTEM FLUSH BUFFER_CACHE;

!rm -f /fra/oradata/ORCL/undotbs01.dbf
OS 단에서 UNDO 데이터파일을 강제로 날려버려 장애 상황을 유발합니다.

INSERT INTO hr.rec157 VALUES (3, 'after failure');
기존 세션은 이미 UNDO 파일 핸들을 열어두었으므로 DML이 들어갑니다. 하지만 롤백(ROLLBACK)을 시도하거나 새로운 세션에서 작업을 시도하면 어떻게 되는지 아래에서 확인합니다.

[세션: 새 터미널 / SQL*Plus (SYSDBA)]
INSERT INTO hr.rec157 VALUES (3, 'after failure');
새로운 세션에서 DML(INSERT, UPDATE, DELETE)을 시도하면 새로운 트랜잭션을 위해 UNDO 파일을 열어야 하므로 즉시 ORA-01116, ORA-01110, Linux Error: 2 (파일 부재) 에러가 발생하며 쓰기 작업이 전면 마비됩니다.

**증상 관찰**
[세션: SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM hr.rec157;
DML은 막혔지만 단순 조회(SELECT)는 아직 정상 동작합니다. (읽기 작업은 UNDO 데이터를 생성할 필요가 없기 때문입니다.)

SELECT file#, error FROM v$recover_file;
아직 백그라운드 프로세스가 파일 부재를 인지하여 딕셔너리에 올리기 전이므로 목록은 비어있습니다.

SELECT tablespace_name, status FROM dba_tablespaces WHERE tablespace_name = 'UNDOTBS1';
데이터 딕셔너리는 여전히 'ONLINE' 정상 상태로 잘못 인식하고 있습니다.

진단 및 복구 시도 (실패 케이스 확인)
[세션: RMAN (Target + Catalog 동시 접속)]
SQL 'ALTER TABLESPACE undotbs1 OFFLINE IMMEDIATE';
일반 테이블스페이스처럼 무중단 복구를 하려고 OFFLINE을 시도합니다. 그러나 ORA-30042: Cannot offline the undo tablespace 에러가 나며 거부당합니다. (UNDO는 활성 트랜잭션들의 롤백 정보를 담고 있어 DB가 스스로 놓을 수 없습니다.)

SQL 'ALTER DATABASE DATAFILE 4 OFFLINE';
그렇다면 데이터파일 단위로 강제 오프라인을 시도해 봅니다. 명령은 먹히지만, 직후 RMAN 세션 자체가 치명적 에러(ORA-00603)를 내뿜으며 죽어버립니다. 이때부터 DB 내의 모든 DML은 ORA-00376 (파일을 읽을 수 없음)으로 막히고 v$transaction조차 조회되지 않는 심각한 정합성 훼손 상태에 빠집니다. 정상 종료(SHUTDOWN IMMEDIATE)도 불가능해집니다.

(결론: UNDO 테이블스페이스는 일반 파일처럼 OFFLINE 무중단 복구를 시도해서는 안 되며, SYSTEM 파일과 마찬가지로 무조건 DB를 내린 뒤 MOUNT 상태에서 복구해야 합니다.)

복구 절차 : 전면 중단 후 복구
[세션: SQL*Plus (SYSDBA)]
SHUTDOWN ABORT
정상 종료가 불가능하므로, 메모리를 날려 인스턴스를 강제로 비정상 종료시킵니다.

[세션: RMAN (Target + Catalog 동시 접속)]
STARTUP MOUNT
컨트롤파일만 여는 복구 전용 모드(MOUNT)로 데이터베이스를 기동합니다.

RESTORE DATAFILE 4;
손상된 4번 UNDO 데이터파일만을 타겟으로 복원(RESTORE)을 수행합니다.

RECOVER DATAFILE 4;
필요한 아카이브 로그와 온라인 리두 로그를 적용해 최신 상태로 동기화(Roll-forward)합니다.

ALTER DATABASE OPEN;
데이터베이스를 정상적으로 엽니다.
```