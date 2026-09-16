```sql
 **초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL member FOR a44

ALTER DATABASE BACKUP CONTROLFILE TO TRACE
    AS '/fra/backup/cold/20260915_105349/cf_ch12.sql' REUSE;

!\grep -n 'CREATE CONTROLFILE' /fra/backup/cold/20260915_105349/cf_ch12.sql

!\sed -n '/"ORCL" RESETLOGS/,/^;/p' /fra/backup/cold/20260915_105349/cf_ch12.sql > /fra/backup/cold/20260915_105349/cf_ch12_resetlogs.sql

!\head -3 /fra/backup/cold/20260915_105349/cf_ch12_resetlogs.sql

CREATE TABLE hr.emp123(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp123 VALUES (1, 'before shutdown');

COMMIT;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

실습 12-2를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
회원님의 실제 백업 경로(/fra/backup/)에 컨트롤파일 TRACE 백업을 받습니다. 백업 스크립트 내부에는 NORESETLOGS 방식과 RESETLOGS 방식 두 가지가 모두 포함되어 있습니다.
리눅스 sed 명령어를 사용하여 RESETLOGS 방식의 컨트롤파일 생성 구문만 패턴으로 잘라내어 전용 재생성 스크립트를 만들어 둡니다.
테스트 테이블을 만들고 1번 데이터를 넣어 둡니다.
데이터베이스가 열려있는(운영 중) 상태이므로 v$datafile_header를 조회하면 당연히 모든 파일의 FUZZY가 YES 상태임을 눈으로 확인해둡니다.

**장애 유발**
SHUTDOWN IMMEDIATE

!\rm -f /u02/oradata/orcl/ *.log
!\rm -f /u02/oradata/orcl/ *.ctl
!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)하여 버퍼 캐시의 모든 변경 사항을 데이터파일에 완벽히 내려쓰고(체크포인트) 스레드를 닫습니다.
이후 운영체제 레벨에서 회원님의 실제 경로(/u02/oradata/orcl/)에 있는 모든 리두 로그 파일(.log)과 컨트롤파일(.ctl)을 강제 삭제하여 전손 장애를 발생시킵니다. 데이터파일들은 삭제하지 않고 온전히 남겨둡니다.


**증상 관찰 및 진단**
STARTUP

SELECT status FROM v$instance;

!\ls /u02/oradata/orcl/ *.ctl 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.log 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l


데이터베이스를 기동(STARTUP)하면 컨트롤파일을 찾지 못해 ORA-00205 에러가 발생하고 NOMOUNT 상태에서 멈춥니다.
OS 명령어로 점검해보면 컨트롤파일(0개)과 리두 로그(0개)는 모두 날아갔지만, 데이터파일(7개)은 온전하게 살아있습니다.
Alert 로그를 통해 장애 직전의 종료 방식이 '정상 종료(CLOSE NORMAL)'였음을 완벽하게 확정 짓습니다.
진단 결론: 정상 종료였기 때문에 데이터파일에 미처 반영되지 않은 리두 데이터는 0(Zero)입니다. 리두 로그가 아예 없기 때문에 기존 리두를 요구하는 NORESETLOGS 방식은 쓸 수 없으며, 반드시 리두를 새로 만들어주는 RESETLOGS 방식의 스크립트를 사용하여 컨트롤파일을 재생성해야 합니다. 적용할 리두가 없으므로 데이터파일은 백업본으로 복원(덮어쓰기)할 필요 없이 현재 디스크에 있는 파일들을 그대로 사용합니다.

**복구 절차**
!\sed -n '/"ORCL" NORESETLOGS/,/^;/p' /fra/backup/cold/20260915_105349/cf_ch12.sql > /fra/backup/cold/20260915_105349/cf_ch12_noresetlogs.sql

@/fra/backup/cold/20260915_105349/cf_ch12_resetlogs.sql

SELECT status FROM v$instance;

SELECT controlfile_type FROM v$database;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

SELECT group#, member FROM v$logfile ORDER BY group#;

!\ls /u02/oradata/orcl/ *.log 2>/dev/null | wc -l

실패를 확인하기 위해 고의로 NORESETLOGS 스크립트를 잘라내 실행해봅니다. LOGFILE 절에 명시된 리두 로그 파일들이 디스크에 없으므로 ORA-01503, ORA-01565 에러를 뿜으며 생성이 거부됩니다.
원인을 확인했으므로 미리 잘라둔 RESETLOGS 방식의 스크립트를 실행합니다. 컨트롤파일이 성공적으로 재생성(Control file created)되며 디비가 MOUNT 상태로 올라옵니다.
MOUNT 상태에서 v$datafile_header를 조회해보면 모든 파일의 SCN이 완벽하게 일치하고 FUZZY 상태가 'NO'로 깔끔하게 떨어져 있음을 확인합니다. 이는 데이터파일들이 일관성을 완벽히 유지하고 있어 RECOVER(미디어 복구) 작업이 1도 필요 없음을 증명합니다.
v$logfile 뷰에는 리두 로그 구성이 등록되어 있지만, OS 상에 아직 물리적인 파일(.log)은 생성되지 않은 상태입니다. 파일은 RESETLOGS로 오픈하는 순간 오라클 엔진이 알아서 생성합니다.

**디비 오픈 및 검증**

ALTER DATABASE OPEN RESETLOGS;

SELECT * FROM v$recover_file;

SELECT id, memo FROM hr.emp123 ORDER BY id;

!\ls -l /u02/oradata/orcl/ *.log

SELECT COUNT(*) FROM v$tempfile;

ALTER TABLESPACE temp ADD TEMPFILE
    '/u02/oradata/orcl/temp01.dbf' SIZE 60M REUSE;

SELECT COUNT(*) FROM v$controlfile;

SELECT group#, COUNT(*) AS members FROM v$logfile GROUP BY group# ORDER BY group#;

SELECT controlfile_type FROM v$database;

SELECT incarnation#, resetlogs_change#, status FROM v$database_incarnation
  ORDER BY incarnation#;

일반 OPEN 명령을 시도하면 컨트롤파일 생성 규정상 RESETLOGS 오픈이 강제된다며 에러(ORA-01589)를 냅니다. 오라클의 요구대로 RESETLOGS 옵션을 사용하여 디비를 엽니다.
테이블 조회를 통해 장애 발생 전에 넣었던 데이터가 손실 없이 100% 보존되어 있음을 확인합니다(데이터파일 복원을 아예 안 했으므로 당연한 결과입니다).
OS 상에 리두 로그 파일들(.log)이 새로운 번호와 함께 방금 막 정상적으로 생성되었음을 확인합니다.
TRACE 기반 생성이므로 TEMP 파일이 날아가 개수가 0개로 나옵니다. 회원님의 실제 경로(/u02/oradata/orcl/)를 지정하여 수동으로 템프 파일을 다시 추가해 줍니다.
인카네이션 이력 역시 날아가서 새로운 번호(2번 등)부터 새로 시작됨을 점검합니다.


**DB정상 확인**
ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM ARCHIVE LOG CURRENT;
```