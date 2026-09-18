```sql
-- 테이블스페이스를 만들고 백업하기 전에 데이터파일이 손상되었다.
-- 백업이 없으므로 복원할 백업 조각이 없다.
-- 빈 파일을 만들고 아카이브를 처음부터 적용해 복구한다. (RMAN은 이 과정을 RESTORE 안에서 대신한다.)
-- NOLOGGING으로 적재한 데이터가 복구되지 않는 것도 확인한다.
-- 복구 유형 : 파일 재생성 후 완전 복구, 무중단

(참고: 앞서 완벽하게 제자리를 찾은 5번(TBS13)과 8번(USERS) 데이터파일의 상태와 운영 디스크 경로 등 현재 타겟 DB의 테이블스페이스 구성 기록을 정확히 기억하고 이어갑니다.)

**사전 조건**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP DATABASE TAG 'BASE_156' PLUS ARCHIVELOG;
실습을 위한 베이스 백업을 수행합니다. (이번 실습의 핵심은 '파일 생성 시점부터 아카이브 로그가 단 하나도 유실 없이 연속적으로 존재해야 한다'는 점입니다.)

**초기 상태 확인**
[세션: SQL*Plus (SYSDBA)]
CREATE TABLESPACE tbs_nb DATAFILE '/fra/oradata/ORCL/tbs_nb01.dbf' SIZE 20M;
백업이 한 번도 수행되지 않을 신규 테이블스페이스를 생성합니다. (현재 운영 환경인 /fra/oradata/ORCL/ 경로 적용)

CREATE TABLE hr.rec156(id NUMBER, memo VARCHAR2(30)) TABLESPACE tbs_nb;
INSERT INTO hr.rec156 VALUES (1, 'logging insert');
COMMIT;
일반적인 로깅(Logging) 방식으로 데이터를 적재합니다.

CREATE TABLE hr.rec156_nl NOLOGGING TABLESPACE tbs_nb AS SELECT LEVEL AS id, 'nologging' AS memo FROM dual CONNECT BY LEVEL <= 100;
의도적으로 리두 로그를 남기지 않는 NOLOGGING 옵션으로 대량의 데이터를 적재합니다.

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.rec156 VALUES (2, 'after switch');
COMMIT;

[세션: RMAN (Target + Catalog 동시 접속)]
LIST BACKUP OF TABLESPACE tbs_nb SUMMARY;
해당 테이블스페이스에 대한 백업본이 저장소에 단 하나도 없음을 확인합니다. (specification does not match any backup)

REPORT UNRECOVERABLE;
방금 수행한 NOLOGGING 작업 때문에 리두가 남지 않아 현재 백업 없이는 복구가 불가능한(Unrecoverable) 파일 목록을 리포트합니다. 9번 파일(tbs_nb01.dbf)이 경고 목록에 뜹니다. (실무라면 즉시 백업해야 하지만 실습을 위해 그대로 둡니다.)

**장애 유발 : 백업 없는 데이터파일 삭제**
[세션: SQL*Plus (SYSDBA)]
ALTER SYSTEM FLUSH BUFFER_CACHE;

!rm -f /fra/oradata/ORCL/tbs_nb01.dbf
백업본이 전혀 없는 신규 데이터파일을 OS에서 강제로 날려버립니다.

[세션: 새 터미널 / SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM hr.rec156;
새 세션에서 쿼리 시, 파일 부재로 인해 ORA-01116 에러가 발생합니다.

**증상 관찰**
[세션: SQL*Plus (SYSDBA)]
SELECT file#, error FROM v$recover_file;
SELECT status FROM v$instance;
해당 파일이 지워졌어도 인스턴스 전체는 안 죽고 OPEN 상태를 유지하며, 다른 기존 테이블스페이스 업무는 정상적으로 계속됩니다.

**진단**
[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE DATAFILE 9 PREVIEW;
복원 시뮬레이션을 돌려보면, 백업 파일이 없어서 에러가 나는 것이 아니라 "datafile 9 will be created automatically during restore operation (복원 과정 중 데이터파일이 자동으로 생성될 것임)" 이라는 문구가 나타납니다.
파일을 생성했던 DDL 로그가 아카이브에 고스란히 남아있으므로, RMAN이 알아서 껍데기 빈 파일을 만들고 리두를 밀어 넣어 살려낼 수 있다는 뜻입니다.

**복구 절차 : 오류 발생 → 원인 파악 → 수정**
[세션: SQL*Plus (SYSDBA)]
ALTER TABLESPACE tbs_nb OFFLINE NORMAL;
무중단 복구를 위해 오프라인을 시도하지만 실패합니다. NORMAL 옵션은 체크포인트를 위해 파일을 읽어야 하는데 물리적 파일이 없기 때문입니다.

ALTER TABLESPACE tbs_nb OFFLINE IMMEDIATE;
체크포인트를 생략하고 즉시 오프라인으로 내려 메모리 락을 끊어냅니다.

[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE TABLESPACE tbs_nb;
RMAN이 백업 조각(Piece)을 복사해 오는 대신, OS 경로에 creating datafile ... 로그를 띄우며 원본 크기(20M)의 빈 껍데기 파일을 스스로 만들어 냅니다.

RECOVER TABLESPACE tbs_nb;
빈 파일에 아카이브 로그와 온라인 리두 로그를 순차적으로 들이부어(Roll-forward) 데이터를 채워 넣습니다.

SQL 'ALTER TABLESPACE tbs_nb ONLINE';
```