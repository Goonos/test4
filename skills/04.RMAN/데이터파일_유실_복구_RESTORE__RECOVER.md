```sql
-- USERS 테이블스페이스의 데이터파일이 유실되었다.
-- SYSTEM이나 UNDO가 아니므로 데이터베이스를 열어 둔 채 복구한다.
-- OFFLINE → RESTORE → RECOVER → ONLINE 순서로 진행한다.
-- 8장의 User Managed 절차와 명령 수를 비교한다.
-- 복구 유형 : 완전 복구, 무중단, 손실 없음

**사전 조건**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP DATABASE TAG 'BASE_15' PLUS ARCHIVELOG;
복구 실습을 위한 깨끗한 기준선(Base)을 마련하기 위해, 전체 데이터베이스와 아카이브 로그를 백업 세트로 생성합니다. PLUS ARCHIVELOG 옵션은 백업 시작 직전과 직후에 각각 로그 스위치를 발생시켜 백업 중 발생하는 리두 데이터까지 안전하게 백업본에 포함시킵니다. (알려주신 핫 백업 경로 적용)

**초기 상태 확인**
[세션: RMAN (Target + Catalog 동시 접속)]
REPORT SCHEMA;

[세션: SQL*Plus (SYSDBA)]
CREATE TABLE hr.rec151(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;
INSERT INTO hr.rec151 VALUES (1, 'after backup');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
백업 수행 직후 데이터의 변경을 시뮬레이션하고, 해당 내용을 아카이브 로그 파일로 분리합니다.

INSERT INTO hr.rec151 VALUES (2, 'in current redo');
COMMIT;
아카이브되지 않은 '현재(CURRENT)' 온라인 리두 로그에만 존재하는 최신 트랜잭션 데이터를 만들어 둡니다. 완전 복구를 통해 이 데이터까지 무사히 살아나는지 최종 확인하기 위함입니다.

**장애 유발 : 데이터파일 삭제**
[세션: SQL*Plus (SYSDBA)]
ALTER SYSTEM FLUSH BUFFER_CACHE;

!rm -f /u02/oradata/orcl/users01.dbf

SELECT COUNT(*) FROM hr.rec151;

[세션: 새 터미널 / SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM hr.employees;
기존 세션에서는 파일 핸들을 쥐고 있어 캐시된 내용을 읽지만, 새로운 세션(새 프로세스)으로 접속하여 쿼리를 시도하면 디스크에서 파일을 새로 열어야 하므로 즉시 ORA-01116, ORA-01110, Linux Error: 2 파일 부재 에러가 발생합니다.

**증상 관찰**
[세션: SQL*Plus (SYSDBA)]
SELECT status FROM v$instance;
USERS 테이블스페이스의 파일이 날아갔지만, 핵심 파일(SYSTEM, UNDO)이 아니기 때문에 인스턴스 전체는 중단(Crash)되지 않고 'OPEN' 상태를 그대로 유지합니다. 이를 통해 무중단 부분 복구가 가능하다는 것을 인지합니다.

SELECT COUNT(*) FROM hr.incr_test;

!tail -8 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log
백그라운드 프로세스가 파일 부재를 인지하여 Alert log에 기록을 남기기 전까지는 알럿에 에러가 뜨지 않음을 확인합니다.

**진단**
[세션: SQL*Plus (SYSDBA)]
SELECT file#, error, change# FROM v$recover_file;
아직 컨트롤파일이나 백그라운드 프로세스가 파일 부재 사실을 딕셔너리에 올리기 전이므로 복구 대상 파일 목록이 비어 있게 나옵니다.

SELECT file_id, tablespace_name FROM dba_data_files WHERE file_id = 7;
파일 헤더를 직접 읽어와야 하는 뷰(dba_data_files)를 조회하여, 해당 뷰에서도 ORA-01116 에러가 똑같이 발생함을 통해 7번 파일 손상을 크로스 체크합니다.

SELECT file#, name, status FROM v$datafile WHERE file# = 7;
오직 컨트롤파일(메모리)만 읽는 뷰(v$datafile)에서는 여전히 'ONLINE' 정상 상태로 잘못 표기되어 있음을 관찰합니다.

[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE DATAFILE 7 PREVIEW SUMMARY;
해당 파일을 복원(Restore)할 때 어떤 백업본과 어느 시점까지의 아카이브 로그 묶음이 적용될 것인지, 빠진 파일은 없는지 안전하게 시뮬레이션(Preview) 해봅니다.

RESTORE DATAFILE 7 VALIDATE;
복원에 사용될 실제 백업 조각 파일들의 물리적 손상(Corrupt) 유무를 검사합니다. 통과 시 안심하고 실복구에 돌입합니다.

**복구 절차 : 오류 발생 → 원인 파악 → 수정**
[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE DATAFILE 7;
파일 상태가 여전히 ONLINE(활성)인 상태에서 무작정 복원을 시도하면, 오라클은 "해당 파일을 다른 놈이 사용(접근) 중인데 덮어쓸 수 없어!" 라며 배타적 잠금(Lock)을 획득하지 못해 실패(ORA-19573, ORA-19890)합니다.

SQL 'ALTER DATABASE DATAFILE 7 OFFLINE';
데이터파일을 명시적으로 '오프라인' 상태로 내려서 데이터베이스가 해당 파일에 걸어둔 잠금(Lock)을 풀어줍니다. 오픈 상태에서의 무중단 데이터파일 복구를 위한 핵심 선결 조건입니다.

RESTORE DATAFILE 7;
잠금이 풀린 상태에서 다시 복원을 실행합니다. (과거 User Managed 백업 방식과 달리 백업 파일 원본 경로를 찾거나 cp 명령어를 쓸 필요 없이, RMAN이 자동으로 알아서 올바른 경로에 파일을 위치시켜 줍니다.)

RECOVER DATAFILE 7;
복원된 과거 시점의 데이터파일에 현재 시점까지의 아카이브 로그와 온라인 리두 로그의 트랜잭션들을 적용(Roll-forward)하여 최신 상태로 동기화시킵니다. RMAN이 복구에 필요한 로그 파일 경로를 알아서 찾아 적용하므로 과정이 자동화되어 있습니다.

SQL 'ALTER DATABASE DATAFILE 7 ONLINE';
복구가 완벽하게 끝난 데이터파일을 다시 온라인 상태로 전환하여 사용자들이 정상 접근할 수 있게 복귀시킵니다.
```