```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT checkpoint_change# FROM v$database;

CREATE TABLE hr.emp104(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp104 VALUES (1, 'seq 1');

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp104 VALUES (2, 'seq 2');

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp104 VALUES (3, 'seq 3');

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp104 VALUES (4, 'seq 4');

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT sequence#, first_change#, next_change#,
            TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
  FROM  v$log_history WHERE sequence# BETWEEN 1 AND 5 ORDER BY sequence#;

SELECT COUNT(*) FROM hr.emp104;

실습 10-3을 마친 상태에서 시간 기반(Time-based) 복구를 위해 세션의 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
테스트용 테이블(hr.emp104)을 만들고, 각각 1번부터 4번까지의 데이터를 입력할 때마다 아카이브 로그를 생성시켜 시퀀스 번호와 데이터를 매칭합니다.
v$log_history를 통해 각 시퀀스가 담고 있는 SCN 범위와 시간을 확인합니다.

**장애 유발**
ALTER SYSTEM FLUSH BUFFER_CACHE;

!\rm -f /u02/oradata/orcl/users01.dbf
!\rm -f /arch1/arch_1_3_*.arc /arch1/arch_1_4_*.arc
!ls /arch1/ | tail -4

버퍼 캐시를 비우고 운영체제 레벨에서 실제 데이터파일 경로인 /u02/oradata/orcl/users01.dbf를 강제 삭제해 장애를 유발합니다.
동시에 아카이브 정리 스크립트 오류를 가정하여, 회원님의 1번 필수 아카이브 경로(/arch1/)에서 시퀀스 3번과 4번 아카이브 로그 파일을 통째로 날려 결손 상황을 만듭니다.

**진단**
SELECT COUNT(*) FROM hr.emp104;

SELECT file#, status FROM v$datafile WHERE file# = 7;

SELECT MIN(sequence#) AS oldest, MAX(sequence#) AS newest, COUNT(*) AS cnt,
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log WHERE status = 'A';

rman target /

CROSSCHECK ARCHIVELOG ALL;

EXIT

SELECT sequence#, status FROM v$archived_log ORDER BY sequence#;

SELECT MIN(sequence#) AS first_missing FROM v$archived_log
  WHERE  status <> 'A';

SELECT MIN(first_change#) AS oldest_online FROM v$log;

SELECT SCN_TO_TIMESTAMP(2424559) AS max_recover_point FROM dual;

!\mkdir -p /fra/backup/cold/20260912_before_104

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260912_before_104/

데이터파일 손상으로 조회 에러(ORA-01116)가 발생함을 인지합니다.
v$archived_log를 조회해보면 지워진 3, 4번 시퀀스 파일이 여전히 상태가 A인 4개로 조회되는데, 이는 OS에서만 강제로 지웠기 때문입니다.
RMAN의 CROSSCHECK 명령을 수행해 컨트롤파일의 기록과 실제 OS 파일 상태를 동기화합니다.
다시 조회하면 지워진 3, 4번 파일이 X(EXPIRED) 상태로 업데이트되어, 3번 시퀀스부터 결손이 생겼음을 정확하게 파악합니다.
온라인 리두로 대체가 불가하므로 3번 시퀀스 직전까지만 리두를 적용하기로 판정하고 현재 상태를 콜드 백업 경로에 임시 백업해 둡니다.

**복구 절차**
SHUTDOWN ABORT

STARTUP MOUNT

!\cp -p /fra/backup/cold/20260911_110657/ *.dbf /u02/oradata/orcl/

SET AUTORECOVERY ON

RECOVER DATABASE UNTIL SEQUENCE 5 THREAD 1;

SELECT file#, error, change# FROM v$recover_file WHERE file# = 1;

RECOVER DATABASE UNTIL SEQUENCE 3 THREAD 1;

데이터베이스를 내리고 리눅스 앨리어스를 무시하는 !\cp -p 명령어를 사용해 회원님의 기존 과거 백업본을 덮어써 복원을 마칩니다.
결손 시퀀스보다 미래인 5번을 목표로 RECOVER를 지시하면, 3번 파일이 없어 중간에 에러(ORA-00308)를 내며 복구가 중단되는 것을 먼저 확인합니다.
이후 결손이 시작된 3번을 그대로 UNTIL SEQUENCE에 입력하여 2번 시퀀스까지만 완벽하게 적용시킵니다. 이미 적용된 구간은 반복 없이 즉시 완료됩니다.

**디비 오픈**
ALTER DATABASE OPEN READ ONLY;

SELECT id, memo FROM hr.emp104 ORDER BY id;

SHUTDOWN IMMEDIATE

STARTUP MOUNT

ALTER DATABASE OPEN RESETLOGS;

적용이 끝난 후 READ ONLY 상태로 데이터베이스를 오픈합니다.
테이블을 조회하여 1, 2번 데이터만 조회되고 3번 파일부터 발생한 결손 구간의 데이터는 의도대로 복구되지 않았음을 시각적으로 검증합니다.
검증이 끝난 후 데이터베이스를 내려 마운트 상태에서 RESETLOGS 옵션으로 오픈합니다.
```