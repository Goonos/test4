```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT checkpoint_change# FROM v$database;

CREATE TABLE hr.emp103 TABLESPACE users
  AS SELECT employee_id, last_name FROM hr.employees;
COMMIT;
SELECT COUNT(*) FROM hr.emp103;
실습 10-2를 마친 상태에서 시간 기반(Time-based) 복구를 위해 세션의 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
테스트용 테이블(hr.emp103)을 107건의 데이터와 함께 생성하여 백업 기준점을 확보하고 아카이브를 발생시킵니다.

ALTER SYSTEM ARCHIVE LOG CURRENT;

**진단**
SELECT sequence#, name FROM v$archived_log
  ORDER BY sequence# DESC FETCH FIRST 2 ROWS ONLY;

BEGIN
    DBMS_LOGMNR.ADD_LOGFILE('/arch1/arch_1_4_1200548120.arc', DBMS_LOGMNR.NEW);
END;
/

EXEC DBMS_LOGMNR.START_LOGMNR(OPTIONS => DBMS_LOGMNR.DICT_FROM_ONLINE_CATALOG);

SELECT scn, TO_CHAR(timestamp, 'HH24:MI:SS') AS t,
         seg_owner, seg_name, operation
  FROM  v$logmnr_contents
  WHERE  seg_owner = 'HR' AND operation IN ('INSERT','DELETE')
  ORDER  BY scn FETCH FIRST 5 ROWS ONLY;

SELECT MIN(scn) AS delete_start FROM v$logmnr_contents
  WHERE  seg_owner = 'HR' AND seg_name = 'EMP103' AND operation = 'DELETE';

EXEC DBMS_LOGMNR.END_LOGMNR;

시각(Time) 기준으로는 초 단위 이하를 나눌 수 없어 20번 정상 데이터까지 날아갈 위험이 있습니다.
따라서 회원님의 실제 1번 아카이브 대상 경로인 /arch1/에 저장된 리두 로그 파일을 오라클 내장 툴인 LogMiner로 뜯어봅니다. 분석 결과 정상 INSERT(2423412)와 잘못된 DELETE(2423418) 작업의 SCN이 다름을 확인하고, DELETE 직전의 SCN인 2423418을 목표 복구 지점으로 판정합니다.

**복구 절차**
SHUTDOWN IMMEDIATE
STARTUP MOUNT
!\cp -p /fra/backup/cold/20260911_110657/ *.dbf /u02/oradata/orcl/

RECOVER DATABASE UNTIL TIME '2026-09-11 11:02:18';

ALTER DATABASE OPEN READ ONLY;

SELECT COUNT(*) FROM hr.emp103;
SELECT id FROM hr.insa_2025 WHERE id >= 20;

SHUTDOWN IMMEDIATE
STARTUP MOUNT

RECOVER DATABASE UNTIL CHANGE 2423418;
리눅스 cp 명령어의 앨리어스 우회를 위해 !\cp -p 강제 덮어쓰기 명령어를 사용하여 회원님의 백업 경로(/fra/backup/cold/...)에서 실제 데이터파일 경로(/u02/oradata/orcl/)로 복원합니다.
먼저 시각 기준(UNTIL TIME)으로 복구를 시도하고 READ ONLY로 확인해보면, DELETE는 취소되었으나 동일한 시각의 정상 데이터(20번)도 억울하게 함께 사라지는 한계를 체감하게 됩니다.
이를 해결하기 위해 덮어쓰기 없이 다시 MOUNT 상태로 내려 UNTIL CHANGE 명령을 수행하여, 목표 SCN(2423418) 직전까지만 리두 로그를 정밀하게 밀어 넣습니다.

**디비 오픈**
ALTER DATABASE OPEN READ ONLY;

SELECT COUNT(*) FROM hr.emp103;

SELECT id, TO_CHAR(order_date, 'HH24:MI:SS') AS t FROM hr.insa_2025
  WHERE  id >= 20 ORDER BY id;

SHUTDOWN IMMEDIATE
STARTUP MOUNT
ALTER DATABASE OPEN RESETLOGS;
SCN 기반 복구를 마친 후 READ ONLY로 데이터베이스를 오픈합니다.
조회 결과 실수로 날렸던 50건은 완벽하게 돌아왔고(107건), 동일한 초에 발생했던 정상 데이터(20번)도 유실 없이 훌륭하게 보존되었음을 확인합니다. (21번은 에러 발생 이후의 미래 데이터라 유실되는 것이 맞습니다.)
검증이 완벽하게 끝났으므로 데이터베이스를 RESETLOGS 옵션으로 오픈하여 서비스를 정상 재개합니다.
```