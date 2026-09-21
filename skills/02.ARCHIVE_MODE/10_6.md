```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS now FROM dual;
NOW
--------
11:11:49

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold/20260914_140204 && \mkdir -p /fra/backup/cold/20260914_140204

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260914_140204/

!\rm -f /fra/backup/cold/20260914_140204/temp01.dbf

STARTUP

SELECT checkpoint_change# FROM v$database;
CHECKPOINT_CHANGE#
------------------
           4438338
           
CREATE TABLE hr.emp106(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp106 VALUES (1, 'first');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS t1 FROM dual;
T1
--------
11:22:20

INSERT INTO hr.emp106 VALUES (2, 'second');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;
T2
--------
11:24:06

실습 10-5를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
데이터베이스를 완전히 종료(SHUTDOWN IMMEDIATE)한 뒤 회원님의 2026년 타임스탬프가 적용된 백업 경로에 데이터파일들을 완벽하게 복사하여 콜드 백업(Cold Backup)을 수행합니다. 
콜드 백업은 핫 백업과 달리 종료 상태에서 복사하므로 모든 파일이 같은 SCN을 가지며 완벽한 일관성을 보장합니다.
다시 데이터베이스를 올리고 테스트 테이블(hr.emp106)을 생성한 뒤, 1번과 2번 데이터를 시간차를 두고 입력하며 아카이브 로그를 생성합니다.

**장애 유발**
TRUNCATE TABLE hr.emp106;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS accident FROM dual;
ACCIDENT
--------
11:28:37

SELECT COUNT(*) FROM hr.emp106;

ALTER SYSTEM ARCHIVE LOG CURRENT;

테스트 테이블의 모든 데이터를 삭제하는 TRUNCATE 명령을 실행하여 장애를 유발합니다. 사고 발생 시각(accident)을 기록하고 아카이브를 발생시킵니다.
TRUNCATE 명령어는 단순 DELETE와 달리 DDL과 유사하게 동작하여 롤백이 불가능하고 UNDO 데이터를 남기지 않는 치명적인 작업입니다.

**진단**
SELECT object_name, original_name FROM recyclebin;

SELECT flashback_on FROM v$database;

SELECT sequence#, first_change#, next_change#,
TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
FROM  v$log_history ORDER BY sequence# DESC FETCH FIRST 4 ROWS ONLY;

!\ls -l /fra/backup/cold/20260914_140204/ *.dbf | wc -l

TRUNCATE 사고는 세그먼트 자체를 잘라버리기 때문에 Flashback Query 시도 시 테이블 정의가 변경되었다는 에러(ORA-01466)가 발생하며 불가능합니다. 휴지통(recyclebin)에도 데이터가 남지 않습니다.
결국 백업본을 이용한 전체 시점 복구가 유일한 대안임을 판정합니다.
이번 복구의 기반은 콜드 백업이므로, 이전 실습의 핫 백업과 달리 최소 복구 지점 제약 없이 백업 시점 이후의 어떤 시간이든 자유롭게 목표 지점(14:14:30)으로 설정할 수 있습니다. 
복구 전 현재 상태를 안전하게 임시 백업합니다.

**복구 절차**
SHUTDOWN IMMEDIATE

STARTUP MOUNT

!cp -p /fra/backup/cold/20260914_111205/ *.dbf /u02/oradata/orcl/

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

ALTER DATABASE OPEN RESETLOGS;

SELECT * FROM v$recover_file;

RECOVER DATABASE UNTIL TIME '2026-09-14 11:24:06';

데이터베이스를 내리고 방금 받아둔 콜드 백업본으로 덮어써 복원을 마칩니다.
v$datafile_header를 조회해보면 모든 파일이 동일한 SCN을 가지며 FUZZY가 NO 상태로 완벽한 일관성을 띄고 있습니다. 
일관성이 완벽하기 때문에 복구를 수행하지 않은 상태에서 무심코 RESETLOGS 오픈을 시도하면 불완전 복구를 수행한 적이 없다며 거절(ORA-01139)당하는 현상을 확인합니다.
사고 직전의 데이터를 살려야 하므로, TRUNCATE 사고 발생 직전 시간인 14:14:30을 목표로 RECOVER 명령을 수행해 정상적으로 데이터를 롤포워드 시킵니다.

**디비 오픈**
ALTER DATABASE OPEN READ ONLY;

SELECT id, memo FROM hr.emp106 ORDER BY id;

SHUTDOWN IMMEDIATE

STARTUP MOUNT

ALTER DATABASE OPEN RESETLOGS;

복구 완료 후 READ ONLY 상태로 데이터베이스를 오픈합니다.
테이블을 조회하여 1번, 2번 데이터가 모두 안전하게 살아있는 것을 시각적으로 확인합니다. 완벽하게 TRUNCATE 직전 시점으로 복구되었습니다.
데이터 검증이 끝났으므로 데이터베이스를 내려 다시 마운트 상태로 올린 후, RESETLOGS 옵션으로 오픈하여 서비스를 재개합니다.
```