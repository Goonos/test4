```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL name FOR a48
COL member FOR a44

SELECT name FROM v$controlfile;

ALTER DATABASE BACKUP CONTROLFILE TO
    '/fra/backup/control_115.bkp' REUSE;

SELECT checkpoint_change# FROM v$database;

CREATE TABLE hr.emp115(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp115 VALUES (1, 'after cf backup');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp115 VALUES (2, 'in current redo');

COMMIT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 11-4를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
현재 사용 중인 컨트롤파일들의 경로를 파악하고, 회원님의 실제 백업 경로(/fra/backup/)에 컨트롤파일을 Binary 형태로 백업해둡니다.
백업 이후에 데이터베이스에 변경이 일어났음을 가정하기 위해 테스트 테이블에 1번(아카이브됨)과 2번(아직 CURRENT 리두에만 존재함) 데이터를 차례로 입력합니다.
v$log를 조회하여 백업 시점에는 CURRENT였던 3번(시퀀스 11)이 지금은 ACTIVE가 되었고, 현재 CURRENT는 4번(시퀀스 12)임을 확인합니다. 이 시차 정보가 나중에 중요한 단서가 됩니다.

**장애 유발**
SHUTDOWN IMMEDIATE

!\rm -f /u02/oradata/orcl/ *.ctl

!\ls /u02/oradata/orcl/ *.ctl 2>/dev/null

데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)하여 데이터파일과 리두 로그에 완벽하게 체크포인트를 수행시킵니다.
그 후 운영체제 레벨에서 회원님의 실제 경로(/u02/oradata/orcl/)에 있는 모든 컨트롤파일(.ctl)을 강제로 삭제하여 컨트롤파일 전손 장애를 발생시킵니다.

**진단**
STARTUP

!\tail -6 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log

SHOW PARAMETER control_files

!\ls -l /fra/backup/control_115.bkp

!\grep -n 'Completed: ALTER DATABASE CLOSE NORMAL' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

데이터베이스를 시작(STARTUP)하면 컨트롤파일을 찾지 못해 인스턴스 기동이 NOMOUNT 상태에서 멈추고 ORA-00205 에러가 떨어집니다. Alert 로그를 보면 파일이 물리적으로 삭제되어 열 수 없음(ORA-00202)을 확인합니다.
파라미터를 조회해 원래 컨트롤파일이 있어야 할 경로들을 확인하고, 백업 경로(/fra/backup/)에 Binary 백업본이 안전하게 존재하는지 점검합니다.
마지막으로 Alert 로그를 통해 이전 종료가 정상 종료였음을 확인하여 데이터 손실 없이 복구가 가능함을 판정합니다.

**복구 절차**
SHUTDOWN ABORT

!\cp -p /fra/backup/control_115.bkp /u02/oradata/orcl/control01.ctl
!\cp -p /fra/backup/control_115.bkp /u02/oradata/orcl/control02.ctl
!\cp -p /fra/backup/control_115.bkp /u02/oradata/orcl/control03.ctl

STARTUP MOUNT

SET AUTORECOVERY ON

RECOVER DATABASE;

SELECT file#, checkpoint_change# FROM v$datafile_header ORDER BY file# FETCH FIRST 3 ROWS ONLY;

SELECT checkpoint_change#, controlfile_type FROM v$database;

데이터베이스를 내리고, 백업받아둔 Binary 컨트롤파일을 파라미터 파일(spfile)에 등록된 모든 컨트롤파일 경로에 동일하게 복사해 넣습니다.
MOUNT 단계로 올린 후 무심코 RECOVER DATABASE를 실행하면 오라클이 ORA-01610 에러를 내며 USING BACKUP CONTROLFILE 옵션을 사용하라고 친절하게 혼냅니다.
조회해보면 복원된 컨트롤파일의 SCN이 현재 데이터파일들의 SCN보다 과거(뒤처져 있음)이므로, 오라클에게 컨트롤파일 대신 데이터파일 헤더를 기준으로 복구를 진행하라고 명시적으로 지시해야 하기 때문입니다.

**올바른 복구 진행 (온라인 리두 수동 지정)**
RECOVER DATABASE USING BACKUP CONTROLFILE;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE;
-- 프롬프트에서 /u02/oradata/orcl/redo03.log 입력

RECOVER DATABASE USING BACKUP CONTROLFILE;
-- 프롬프트에서 /u02/oradata/orcl/redo04.log 입력

USING BACKUP CONTROLFILE 옵션을 주고 복구를 시작하면 아카이브 로그는 자동 적용되다가 마지막 시퀀스(12번)에서 파일이 없다(ORA-00308)며 멈춥니다. 12번은 아직 아카이브 되지 않은 CURRENT 리두 로그 안에 들어있기 때문입니다.
이때 백업된 컨트롤파일은 자신이 백업될 당시의 기억(3번 그룹이 CURRENT)만 가지고 있으므로, 프롬프트에 3번 그룹의 멤버(/u02/oradata/orcl/redo03.log)를 던져주면 오라클이 파일을 까보고 "여기엔 11번이 들어있는데요?"(ORA-00310)라고 알려줍니다. 
그 힌트를 받아 순환 구조상 다음 번호인 4번 그룹의 멤버(/u02/oradata/orcl/redo04.log)를 다시 던져주면 완벽하게 매칭되며 복구(Media recovery complete)가 완료됩니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;
```