```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL name FOR a48

CREATE TABLESPACE tbs06
    DATAFILE '/u02/oradata/orcl/tbs06.dbf' SIZE 20M;

ALTER DATABASE BACKUP CONTROLFILE TO TRACE
    AS '/fra/backup/cf_116.sql' REUSE;

!\grep -n 'CREATE CONTROLFILE' /fra/backup/cf_116.sql

!\sed -n '/^CREATE CONTROLFILE.*NORESETLOGS/,/^;/p' /fra/backup/cf_116.sql | head -11

SELECT incarnation#, resetlogs_change# FROM v$database_incarnation
  WHERE  status = 'CURRENT';

INSERT INTO hr.emp115 VALUES (3, 'before trace test');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

DROP TABLESPACE tbs06 INCLUDING CONTENTS AND DATAFILES;

ALTER SYSTEM ARCHIVE LOG CURRENT;

실습 11-5를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
컨트롤파일 TRACE 백업의 특징(구조 불일치 시 대처)을 실습하기 위해, 테스트용 테이블스페이스(tbs06)를 만들고 회원님의 경로(/fra/backup/)에 TRACE 백업을 받습니다. 백업 스크립트 안에 NORESETLOGS 방식과 RESETLOGS 방식 두 가지가 모두 내장되어 있음을 확인합니다.
이후 테이블에 데이터를 넣고 아카이브를 발생시킨 뒤, TRACE 백업을 다시 받지 않은 채로 방금 만들었던 tbs06 테이블스페이스를 삭제해버립니다. 이로써 백업된 스크립트 내용(tbs06 존재)과 실제 DB 구조(tbs06 없음)가 물리적으로 어긋나게 됩니다.

**장애 유발**
SHUTDOWN IMMEDIATE

!\rm -f /u02/oradata/orcl/ *.ctl

데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)하여 데이터파일과 리두 로그에 체크포인트를 완벽히 수행시킵니다.
그 후 회원님의 실제 경로(/u02/oradata/orcl/)에 있는 모든 컨트롤파일(.ctl)을 강제로 삭제하여 컨트롤파일 전손 장애를 발생시킵니다.

**진단**
STARTUP

SELECT status FROM v$instance;

!\grep -n 'Completed: ALTER DATABASE CLOSE NORMAL' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

!\ls /u02/oradata/orcl/ *.log

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

!\sed -n '/^CREATE CONTROLFILE.*NORESETLOGS/,/^;/p' /fra/backup/cf_116.sql \
        | grep -c 'dbf'

데이터베이스를 올리면 컨트롤파일이 없어 NOMOUNT 상태에서 멈춥니다(ORA-00205).
Alert 로그를 통해 이전 종료가 정상 종료(CLOSE NORMAL)였음을 확인합니다. 
운영체제 레벨에서 리두 로그 파일들이 온전히 남아있는지 확인합니다. 정상 종료와 온전한 리두 로그 파일은 'NORESETLOGS' 방식으로 컨트롤파일을 재생성할 수 있는 필수 조건입니다.
하지만 실제 남아있는 데이터파일 수(7개)와 TRACE 스크립트 안에 기록된 데이터파일 수(8개)가 일치하지 않음을 발견합니다. 이는 앞서 테이블스페이스를 삭제하고 백업을 다시 받지 않았기 때문입니다.

**복구 절차 (스크립트 수정 및 재생성)**
!\sed -n '/^CREATE CONTROLFILE.*NORESETLOGS/,/^;/p' /fra/backup/cf_116.sql \
        > /fra/backup/cf_116_noresetlogs.sql

@/fra/backup/cf_116_noresetlogs.sql

!\ls /u02/oradata/orcl/ *.dbf

!\sed -i '/tbs06.dbf/d' /fra/backup/cf_116_noresetlogs.sql

!\grep -c 'dbf' /fra/backup/cf_116_noresetlogs.sql

!\sed -i '/tbs02.dbf/s/,$//' /fra/backup/cf_116_noresetlogs.sql

!\tail -4 /fra/backup/cf_116_noresetlogs.sql

@/fra/backup/cf_116_noresetlogs.sql

SELECT name, open_mode FROM v$database;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

SELECT * FROM v$recover_file;

TRACE 스크립트 안에서 NORESETLOGS 구문만 잘라내어 별도의 재생성 스크립트를 만듭니다.
그대로 실행해보면 이미 삭제되고 없는 tbs06.dbf 파일을 찾다가 ORA-01565 에러를 뿜으며 재생성에 실패합니다(ORA-01503). Binary 백업이었다면 복구가 까다로웠겠지만 텍스트 형태인 TRACE 백업이므로 스크립트를 직접 편집하여 해결할 수 있습니다.
에러가 난 `tbs06.dbf` 라인을 삭제하고, 그 앞줄(`tbs02.dbf`) 끝에 덩그러니 남은 쉼표(,)까지 문법에 맞게 깔끔하게 제거해 줍니다.
수정한 스크립트를 다시 실행하면 정상적으로 컨트롤파일이 재생성(Control file created)되며 데이터베이스가 MOUNT 됩니다.
정상 종료 기반이었으므로 v$datafile_header를 확인해보면 모든 파일의 SCN이 동일하고 FUZZY가 NO 상태라 추가적인 복구(RECOVER DATABASE)가 전혀 필요하지 않음을 확인합니다.

**디비 오픈**
ALTER DATABASE OPEN;
```