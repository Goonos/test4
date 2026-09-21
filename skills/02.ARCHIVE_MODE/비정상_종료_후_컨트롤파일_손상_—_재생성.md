```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL name FOR a48

SELECT checkpoint_change# FROM v$database;

CREATE TABLE hr.emp117(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp117 VALUES (1, 'archived');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp117 VALUES (2, 'current redo');

COMMIT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\ls -l /fra/backup/cf_after_116.sql

실습 11-6을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
테스트 테이블을 만들어 1번 데이터를 아카이브에 밀어넣고, 2번 데이터를 입력하여 CURRENT 리두 로그(시퀀스 14)에만 존재하게끔 상황을 세팅합니다.
이전 실습에서 생성해 둔 회원님의 실제 백업 경로(/fra/backup/)의 컨트롤파일 TRACE 백업 스크립트가 온전히 존재하는지 확인합니다.

**장애 유발**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/ *.ctl

!\ls /u02/oradata/orcl/ *.ctl 2>/dev/null

이전 실습들(정상 종료)과 명확히 구분되도록 비정상 종료(SHUTDOWN ABORT)를 수행하여 데이터파일에 미처 반영되지 못한(체크포인트 안 된) 데이터들이 존재하게 만듭니다.
그 상태에서 운영체제 레벨에서 회원님의 실제 경로(/u02/oradata/orcl/)에 있는 모든 컨트롤파일(.ctl)을 강제 삭제해 컨트롤파일 전손 장애를 발생시킵니다.

**진단**
STARTUP

!\grep -n 'instance (abort)\|Completed: ALTER DATABASE CLOSE NORMAL' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -2

!\ls /u02/oradata/orcl/ *.log | wc -l

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

!\sed -n '/^CREATE CONTROLFILE.*NORESETLOGS/,/^;/p' /fra/backup/cf_after_116.sql \
        | grep -c 'dbf'

!\ls /arch1/ *.arc | wc -l

데이터베이스를 올리면 ORA-00205 에러가 발생하며 NOMOUNT 상태에서 멈춥니다.
Alert 로그를 통해 직전 종료가 비정상(abort) 종료였음을 확인하여, 리두 로그를 통한 크래시 복구가 필수적임을 판단합니다.
리두 로그 파일들이 온전히 존재함을 확인했으므로, TRACE 백업본을 이용해 NORESETLOGS 방식으로 컨트롤파일을 재생성하기로 복구 방향을 판정합니다. (만약 리두 로그도 깨졌다면 RESETLOGS 방식을 써야 합니다.)

**복구 절차**
!\sed -n '/^CREATE CONTROLFILE.*NORESETLOGS/,/^;/p' /fra/backup/cf_after_116.sql \
        > /fra/backup/cf_117_noresetlogs.sql

@/fra/backup/cf_117_noresetlogs.sql

SELECT name, open_mode, controlfile_type FROM v$database;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

ALTER DATABASE OPEN;

COL member FOR a44

SELECT l.group#, l.sequence#, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.sequence#;

TRACE 백업 스크립트에서 NORESETLOGS 구문만 정밀하게 잘라내어 새로운 재생성 스크립트를 만듭니다.
해당 스크립트를 실행하여 컨트롤파일을 회원님의 실제 경로에 재생성(Control file created)합니다.
재생성 성공 후 디비를 바로 열어보려 시도하지만, 비정상 종료의 여파로 데이터파일들의 FUZZY 상태가 YES라 롤포워드 과정이 필요하다며 미디어 복구(ORA-01113)를 요구합니다.
재생성된 컨트롤파일은 11-5의 Binary 백업본과 달리 온라인 리두 로그 헤더를 직접 읽어 현재 리두의 위치(시퀀스 14)를 정확히 파악하고 있음을 확인합니다.

**올바른 복구 진행 및 디비 오픈**
SET AUTORECOVERY ON

RECOVER DATABASE;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

ALTER DATABASE OPEN;

새로 생성된 컨트롤파일이 아카이브부터 온라인 리두까지 모든 경로와 시퀀스를 꿰뚫고 있으므로, 단순 RECOVER DATABASE 명령 하나만 날려주면 오라클이 알아서 끝까지 완벽하게 밀어 넣습니다. (USING BACKUP CONTROLFILE 옵션도, 수동 리두 지정도 필요 없습니다.)
복구 완료 후 데이터파일들의 FUZZY가 NO로 깔끔하게 떨어졌음을 확인합니다.
인카네이션을 끊어낼 이유가 없으므로 RESETLOGS 옵션 없이 일반 OPEN 명령어로 데이터베이스를 시원하게 열어줍니다.
```