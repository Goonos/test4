```sql
-- SYSTEM 데이터파일이 손상되었다.
-- SYSTEM은 OFFLINE으로 내릴 수 없어 무중단 복구가 불가능하다.
-- MOUNT 상태로 내려 복구한 뒤 다시 연다.
-- 손상된 파일만 복원해 복구 시간을 줄인다.
-- 복구 유형 : 완전 복구, 전면 중단, 손실 없음

**사전 조건**
(이전 실습에서 생성한 BASE_15 백업 세트를 그대로 재사용하므로 별도의 추가 백업은 생략합니다.)

**초기 상태 확인**
[세션: SQL*Plus (SYSDBA)]
CREATE TABLE hr.rec153(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;
INSERT INTO hr.rec153 VALUES (1, 'after backup');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
백업 이후의 트랜잭션을 아카이브 로그로 생성합니다.

INSERT INTO hr.rec153 VALUES (2, 'in current redo');
COMMIT;
아직 아카이빙 되지 않은 온라인 리두 로그(CURRENT)에만 담긴 최신 데이터를 생성합니다. 복구 후 유실 여부를 대조할 타겟입니다.

SELECT file#, name FROM v$datafile WHERE file# = 1;

**장애 유발 : SYSTEM 데이터파일 삭제**
[세션: SQL*Plus (SYSDBA)]
ALTER SYSTEM FLUSH BUFFER_CACHE;

!rm -f /u02/oradata/orcl/system01.dbf
데이터베이스의 두뇌 역할을 하는 가장 핵심적인 SYSTEM 테이블스페이스(1번 파일)를 OS 단에서 삭제(손상)하여 장애 상황을 유발합니다. (운영 경로 반영)

[세션: 새 터미널 / SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM dba_objects;
새로운 세션으로 접속해 데이터 사전(Dictionary)을 조회하는 쿼리를 던집니다. SYSTEM 데이터파일이 없어 데이터 사전을 읽지 못하므로, 유저 쿼리 에러인 ORA-01116보다 선행하여 재귀(Recursive) 쿼리 에러인 ORA-00604가 먼저 튀어나옵니다.

**증상 관찰**
[세션: SQL*Plus (SYSDBA)]
SELECT file#, error FROM v$recover_file;

!tail -8 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log
알럿 로그를 까보면 백그라운드 프로세스가 파일 부재를 인지하고 Health Monitor를 통해 Persistent Data Failure로 진단, 에러 로그를 남기고 있음을 확인할 수 있습니다.

SELECT status FROM v$instance;
치명적인 SYSTEM 데이터파일이 날아갔음에도 인스턴스가 즉시 비정상 종료(Crash)되지는 않고 여전히 'OPEN' 상태를 버티며 매달려 있습니다. 캐시된 메모리로 버티는 좀비 상태에 가깝습니다.

SHUTDOWN IMMEDIATE
데이터베이스를 정상적으로 닫으려 시도하지만, 체크포인트 과정에서 SYSTEM 헤더 파일에 정보를 써야 하는데 파일이 물리적으로 없으므로 쓰기가 불가능해져 종료 명령이 ORA-01116 에러와 함께 거부당합니다.

**진단**
[세션: SQL*Plus (SYSDBA)]
ALTER DATABASE DATAFILE 1 OFFLINE;
이전 실습(USERS 등 일반 테이블스페이스)처럼 무중단 복구를 하기 위해 SYSTEM 파일을 오프라인으로 내리려 시도해 봅니다. 오라클은 "SYSTEM 테이블스페이스는 절대 OFFLINE으로 내릴 수 없다(ORA-01541)"며 단호히 거부하고 데이터베이스 전체 셧다운을 요구합니다. SYSTEM 손상 시에는 무조건 '전면 중단' 복구만이 유일한 답임을 확인하는 과정입니다.

SHUTDOWN ABORT
정상 종료(IMMEDIATE)가 불가능하므로, 메모리를 날려 인스턴스를 강제로 비정상 종료(Abort)시킵니다.

[세션: Linux OS Shell]
ps -ef | grep [p]mon_orcl
PMON 프로세스가 죽어 인스턴스가 완전히 내려갔는지 OS 레벨에서 재확인합니다.

[세션: RMAN (Target + Catalog 동시 접속)]
STARTUP MOUNT
데이터베이스를 복구 전용 모드인 'MOUNT' 상태까지만 올려 컨트롤파일만 열어둡니다.

[세션: SQL*Plus (SYSDBA)]
SELECT file#, error FROM v$recover_file;
컨트롤파일이 정상적으로 열렸으므로 이제 v$recover_file 뷰를 조회해 보면 비로소 1번 파일이 FILE NOT FOUND 상태임이 딕셔너리에 정확히 잡힙니다.

[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE DATABASE PREVIEW SUMMARY;

**복구 절차 : 오류 발생 → 원인 파악 → 수정**
[세션: RMAN (Target + Catalog 동시 접속)]
ALTER DATABASE OPEN;
아직 1번 파일이 물리적으로 복구되지 않았는데 무작정 데이터베이스를 열어보려 시도하면, 오픈 필수 조건인 SYSTEM 파일이 없기 때문에 ORA-01157과 함께 오픈이 거부됩니다.

SQL 'ALTER DATABASE DATAFILE 1 OFFLINE';
MOUNT 상태에서는 컨트롤파일 안의 논리적인 포인터만 오프라인으로 조작하는 것이 가능하므로 이 명령 자체가 에러 없이 통과는 됩니다.

ALTER DATABASE OPEN;
그러나 1번 파일이 오프라인인 상태 그대로 DB를 열려고 시도하면 ORA-01147 (SYSTEM tablespace file is offline) 에러를 뱉으며 결국 열리지 않습니다. 즉, SYSTEM 파일은 무조건 정상적으로 온라인 상태로 복구해 놓아야만 데이터베이스가 열립니다.

RESTORE DATAFILE 1;
멀쩡한 다른 파일들까지 통째로 과거로 돌리는 RESTORE DATABASE 대신, 손상된 1번 파일 딱 하나만 복원합니다. 복원 대상을 최소화하여 복구 소요 시간을 획기적으로 줄이는 핵심 스킬입니다. (운영 경로로 자동 복원 적용)

RECOVER DATAFILE 1;
복원된 1번 파일에만 타임라인을 맞추기 위한 아카이브 및 온라인 리두 로그 적용(Roll-forward)을 수행합니다.

SQL 'ALTER DATABASE DATAFILE 1 ONLINE';
복구가 완료된 SYSTEM 파일을 다시 온라인으로 살려냅니다.

ALTER DATABASE OPEN;
마침내 데이터베이스 오픈을 시도합니다. 과거 컨트롤파일을 가져온 불완전 복구가 아니라, 기존 장애 직전의 최신 운영 컨트롤파일을 그대로 사용한 '완전 복구'이기 때문에 RESETLOGS 옵션 없이 깔끔하게 오픈됩니다.
```