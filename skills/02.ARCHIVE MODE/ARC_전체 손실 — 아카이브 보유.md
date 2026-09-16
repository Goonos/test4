```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

ALTER DATABASE BEGIN BACKUP;

!\rm -rf /fra/backup/hot12 && \mkdir -p /fra/backup/hot12

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/hot12/

!\rm -f /fra/backup/hot12/temp01.dbf

ALTER DATABASE END BACKUP;

ALTER SYSTEM ARCHIVE LOG CURRENT;

ALTER DATABASE BACKUP CONTROLFILE TO TRACE
    AS '/fra/backup/cf_ch12.sql' REUSE;

!\sed -n '/"ORCL" RESETLOGS/,/^;/p' /fra/backup/cf_ch12.sql > /fra/backup/cf_ch12_resetlogs.sql

CREATE TABLE hr.emp126(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp126 VALUES (1, 'after hot backup');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp126 VALUES (2, 'archived too');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp126 VALUES (3, 'only in current redo');
COMMIT;

SELECT MAX(sequence#) AS archived_max FROM v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 12-5를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
안전한 복구를 위해 핫 백업(Hot Backup)을 수행하여 회원님의 백업 경로(/fra/backup/hot12)에 데이터파일들을 복사하고 백업 모드를 종료합니다. 백업 직후 아카이브를 발생시켜 백업 구간의 리두를 안전하게 확보합니다.
이후 컨트롤파일 TRACE 백업을 받고, 리눅스 sed 명령어로 RESETLOGS 방식의 컨트롤파일 생성 구문만 잘라내어 전용 재생성 스크립트를 만들어 둡니다.
테스트 테이블을 생성해 1, 2번 데이터는 아카이브에 밀어넣고, 3번 데이터는 아카이브 되지 않은 CURRENT 리두 그룹에만 남겨두어 데이터 손실 범위를 미리 세팅합니다.

**장애 유발**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/ *.dbf

!\rm -f /u02/oradata/orcl/ *.log

!\rm -f /u02/oradata/orcl/ *.ctl

!\ls /arch1/ *.arc | wc -l

!\ls /fra/backup/hot12/ *.dbf | wc -l

비정상 종료(SHUTDOWN ABORT)를 수행하여 인스턴스를 강제로 죽입니다.
회원님의 실제 데이터파일 경로(/u02/oradata/orcl/)에 있는 데이터파일(.dbf), 리두 로그 파일(.log), 컨트롤파일(.ctl) 세 종류를 모두 강제 삭제하여 데이터베이스 전체 전손(Total Loss) 장애를 발생시킵니다.
OS 레벨에서 확인해보면 원본 파일들은 모두 사라졌지만, 다른 디스크에 보관 중인 아카이브 로그 파일들과 조금 전 받아둔 핫 백업본은 온전하게 살아있음을 확인합니다.

**진단**
STARTUP

SELECT status FROM v$instance;

!\ls /u02/oradata/orcl/ *.dbf 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.log 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.ctl 2>/dev/null | wc -l

!\ls -t /arch1/ *.arc | head -3

데이터베이스를 기동(STARTUP)하면 컨트롤파일이 없으므로 ORA-00205 에러가 발생하고 NOMOUNT 상태에서 멈춥니다.
OS 명령어를 통해 점검해보면 데이터파일(0개), 리두 로그(0개), 컨트롤파일(0개)이 모두 완벽하게 삭제된 것을 눈으로 재확인합니다.
아카이브 경로(/arch1)를 확인해보면 1, 2번 데이터까지 담긴 아카이브는 안전하게 보존되어 있으나, 3번 데이터가 담겨있던 CURRENT 그룹은 아카이브 되기 전에 파일과 함께 삭제되었으므로 해당 구간(마지막 스위치 이후)의 손실은 피할 수 없게 되었습니다.
진단 결론: 파일 3종이 모두 날아간 전체 손실 상황입니다. TRACE 백업본과 핫 백업 데이터파일, 아카이브 로그를 조합하여 불완전 복구(UNTIL CANCEL)를 진행해야 합니다.

**복구 절차**
@/fra/backup/cf_ch12_resetlogs.sql

!\cp -p /fra/backup/hot12/ *.dbf /u02/oradata/orcl/

@/fra/backup/cf_ch12_resetlogs.sql

SELECT controlfile_type FROM v$database;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

RECOVER DATABASE;

SET AUTORECOVERY ON

RECOVER DATABASE USING BACKUP CONTROLFILE UNTIL CANCEL;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE UNTIL CANCEL;
-- 프롬프트에서 CANCEL 입력

SELECT file#, checkpoint_change#, fuzzy,
            TO_CHAR(checkpoint_time, 'YYYY-MM-DD HH24:MI:SS') AS checkpoint_time
  FROM  v$datafile_header WHERE file# IN (1, 7);

전체 손실 시에는 무작정 컨트롤파일 재생성 스크립트를 돌리면 데이터파일의 헤더를 읽지 못해 ORA-01503, ORA-01565 에러를 내며 실패합니다. 따라서 데이터파일 복원(복사)이 컨트롤파일 생성보다 먼저 이루어져야 합니다.
핫 백업본 데이터파일들을 디스크 경로에 복원해 넣은 뒤 다시 스크립트를 실행하면 컨트롤파일이 성공적으로 재생성(Control file created)됩니다.
핫 백업본이므로 데이터파일의 FUZZY가 YES 상태임을 확인합니다. 이를 해결하기 위해 무심코 RECOVER DATABASE를 치면 컨트롤파일이 복구 한계를 파악하지 못해 거부당합니다(ORA-01610).
USING BACKUP CONTROLFILE UNTIL CANCEL 옵션을 주어 아카이브 자동 복구를 시작합니다. 아카이브를 순조롭게 적용하다가 삭제된 CURRENT 구간의 파일이 없다며 ORA-00308과 함께 멈춥니다.
자동 복구를 끄고 다시 명령을 친 뒤, 파일 이름을 묻는 프롬프트에 'CANCEL'을 입력하여 미디어 복구를 강제로 마무리합니다.
v$datafile_header를 조회해 FUZZY가 NO로 떨어졌음을 확인하고, RESETLOGS 이후에는 SCN_TO_TIMESTAMP가 엉뚱한 값을 내므로 디비를 열기 전에 checkpoint_time을 명확히 기록(복구 시점)해 둡니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;

불완전 복구(UNTIL CANCEL)를 수행했고, 리두 로그 파일이 전혀 없는 상태에서 컨트롤파일을 RESETLOGS 방식으로 재생성했기 때문에 반드시 RESETLOGS 옵션으로 데이터베이스를 오픈해야 합니다. 이 순간 새로운 리두 로그 파일들이 빈 상태로 생성됩니다.
```