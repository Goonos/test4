```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL member FOR a44

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold/20260914_154500; \mkdir -p /fra/backup/cold/20260914_154500

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260914_154500/

!\rm -f /fra/backup/cold/20260914_154500/temp01.dbf

STARTUP

CREATE TABLE hr.emp111(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp111 VALUES (1, 'before shutdown');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT l.group#, l.sequence#, l.archived, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.group#;

SELECT MAX(sequence#) AS archived_max FROM v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

실습 10-7을 마친 상태에서 리두 로그 관리를 위한 환경을 세팅합니다.
안전한 기준점 확보를 위해 디비를 정상 종료하고 회원님의 백업 경로로 2026년 타임스탬프 기반 콜드 백업을 새로 받습니다.
테스트용 테이블을 생성해 1번 데이터를 넣고 아카이브를 발생시킵니다.
v$log와 v$logfile을 조인하여 현재 시스템의 리두 로그 그룹 상태를 파악합니다. 그룹 1번이 현재 사용 중인 CURRENT 그룹이고 아직 아카이브 되지 않았음을(ARCHIVED=NO) 확인합니다.

**장애 유발**
INSERT INTO hr.emp111 VALUES (2, 'in current redo');

COMMIT;

SHUTDOWN IMMEDIATE

!\rm -f /u02/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

!\ls /u02/oradata/orcl/ *.log

CURRENT 그룹인 1번에 저장되도록 2번 데이터를 넣고 커밋합니다.
데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)하여 디스크(데이터파일)에 완벽하게 체크포인트를 수행시킵니다.
이후 운영체제 레벨에서 회원님의 실제 경로에 있는 그룹 1번의 모든 멤버 파일들을 강제 삭제하여 CURRENT 그룹 전손 장애를 유발합니다.

**진단**
STARTUP

!\grep -B3 'terminating the instance' \
          /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -4

STARTUP MOUNT

SELECT group#, member, status FROM v$logfile WHERE group# = 1;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\grep -n 'Completed: ALTER DATABASE CLOSE NORMAL' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

데이터베이스를 기동(STARTUP)하면 MOUNT 단계까지는 올라가지만 OPEN 단계에서 ORA-03113 에러를 뿜으며 인스턴스가 튕겨버립니다. Alert 로그를 열어보면 삭제된 1번 리두 그룹 파일이 없어 ORA-00313이 발생했음을 확인할 수 있습니다.
처리를 위해 STARTUP MOUNT 상태로 다시 올립니다.
v$log 뷰를 통해 손상된 그룹 1번이 CURRENT이자 ARCHIVED가 NO임을 확인합니다.
Alert 로그에서 이전 종료가 NORMAL(정상 종료)이었음을 확인하고, v$datafile_header에서 모든 파일의 FUZZY 상태가 NO인 것을 확인합니다. 이는 체크포인트가 완벽해 리두 파일이 없어도 데이터 손실이 없음을 뜻합니다.

**복구 절차**
ALTER DATABASE CLEAR LOGFILE GROUP 1;

COL destination FOR a20
COL error FOR a40

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

ALTER SYSTEM ARCHIVE LOG ALL;

ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 1;

SELECT group#, sequence#, archived, status FROM v$log WHERE group# = 1;

!\ls -l /u02/oradata/orcl/redo01.log

일반적인 CLEAR 명령을 내리면 아직 아카이브가 되지 않았다며 거절(ORA-00350)당합니다.
습관적으로 UNARCHIVED 옵션을 쓰기 전에 v$archive_dest를 조회해 아카이브 경로 상태가 정상(VALID)임을 확인하고, ARCHIVE LOG ALL 명령을 날려 정상 종료 시점에서는 더 이상 아카이브 할 리두가 없음(ORA-00271)을 확인하여 파일 자체의 부재를 완벽히 증명합니다.
증명이 끝났으므로 ALTER DATABASE CLEAR UNARCHIVED 명령을 날려 아카이브 없이 그룹 1번을 강제 초기화시킵니다.
회원님의 실제 디스크 경로에 1번 리두 로그 파일이 재생성되고 v$log 상태가 UNUSED로 깔끔하게 정리되었음을 확인합니다.

**디비 오픈**
ALTER DATABASE OPEN;

정상 종료 기반이었기 때문에 불완전 복구를 수행할 필요가 없어 RESETLOGS 없이 일반 OPEN 명령어로 깔끔하게 데이터베이스가 열립니다.
```