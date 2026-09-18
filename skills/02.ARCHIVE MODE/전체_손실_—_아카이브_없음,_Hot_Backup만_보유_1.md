```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold12 && \mkdir -p /fra/backup/cold12

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold12/
!\cp -p /u02/oradata/orcl/ *.ctl /fra/backup/cold12/
!\cp -p /u02/oradata/orcl/ *.log /fra/backup/cold12/

!\ls /fra/backup/cold12/ | wc -l

STARTUP

CREATE TABLE hr.emp127(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp127 VALUES (1, 'before hot backup');

COMMIT;

ALTER DATABASE BEGIN BACKUP;

!\rm -rf /fra/backup/hot12 && \mkdir -p /fra/backup/hot12

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/hot12/

!\rm -f /fra/backup/hot12/temp01.dbf

ALTER DATABASE END BACKUP;

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp127 VALUES (2, 'after hot backup');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 12-6을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
다음 실습(12-8)을 위해 정상 종료 후 3종 세트(데이터파일, 컨트롤파일, 리두 로그)를 모두 포함하는 완벽한 콜드 백업을 회원님의 백업 경로(/fra/backup/cold12)에 미리 받아 둡니다. 
디비를 올리고 테스트 테이블을 만들어 데이터를 넣습니다.
이번 실습의 주인공인 핫 백업(Hot Backup)을 수행합니다. 디비가 열려있는 상태에서 백업 모드를 켜고 회원님의 경로(/fra/backup/hot12)로 데이터파일들을 복사한 뒤 백업 모드를 종료합니다.
이후 아카이브를 여러 번 발생시키고 v$log를 조회하여, 핫 백업이 수행된 구간이 시퀀스 1번 리두 안에 포함되어 있음을 파악합니다.


**장애 유발**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/ *.dbf
!\rm -f /u02/oradata/orcl/ *.log
!\rm -f /u02/oradata/orcl/ *.ctl

!\rm -f /arch1/ *.arc

!\ls /arch1/ *.arc 2>/dev/null | wc -l

!\ls /fra/backup/hot12/ *.dbf | wc -l

비정상 종료(SHUTDOWN ABORT)를 수행합니다.
회원님의 실제 데이터파일 경로(/u02/oradata/orcl/)에 있는 데이터파일, 리두 로그 파일, 컨트롤파일을 모두 강제 삭제합니다.
가장 치명적인 상황을 묘사하기 위해, 아카이브 로그 파일마저 같은 스토리지에 있었다고 가정하고 회원님의 아카이브 경로(/arch1)에 있는 모든 아카이브 파일(.arc)을 싹 다 지워버립니다.
OS에서 확인해보면 원본 3종 세트와 아카이브 로그가 모두 전손(0개)되었고, 오직 회원님의 백업 경로에 받아둔 핫 백업 데이터파일만 유일하게 살아남았음을 확인합니다.

**진단**
STARTUP

SELECT status FROM v$instance;

!\ls /u02/oradata/orcl/ *.dbf 2>/dev/null | wc -l

!\ls /arch1/ *.arc 2>/dev/null | wc -l

!\ls /fra/backup/hot12/ *.dbf 2>/dev/null | wc -l

!\ls /fra/backup/cold12/ *.dbf 2>/dev/null | wc -l

데이터베이스를 기동(STARTUP)하면 컨트롤파일이 없어 NOMOUNT 상태에서 멈춥니다(ORA-00205).
OS 명령어로 점검해보면 원본 파일과 아카이브 로그는 전손되었고, 백업본(hot12, cold12)만 남아있습니다.
진단 결론: 전체 전손 + 아카이브 전손 상황입니다. 당장 눈앞에 핫 백업본이 있으므로 복구를 시도해 보겠지만, 핫 백업은 파일 복사 도중에 블록이 변경되어 일관성이 깨져(FUZZY) 있으므로 이를 맞춰줄 아카이브(시퀀스 1번)가 필수적입니다. 하지만 아카이브마저 날아갔으므로 복구 실패가 불 보듯 뻔히 예상됩니다. 이를 직접 눈으로 확인해 봅니다.

**복구 절차 (실패 확인)**
!\cp -p /fra/backup/hot12/ .dbf /u02/oradata/orcl/

@/fra/backup/cf_ch12_resetlogs.sql

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

SELECT file#, status, change#,
            TO_CHAR(time, 'YYYY-MM-DD HH24:MI:SS') AS begin_time
  FROM  v$backup ORDER BY file#;

ALTER DATABASE OPEN RESETLOGS;

RECOVER DATABASE USING BACKUP CONTROLFILE UNTIL CANCEL;
-- 프롬프트에서 CANCEL 입력

ALTER DATABASE OPEN RESETLOGS;

핫 백업 데이터파일들을 원본 경로로 덮어쓰고, 12-6에서 잘라두었던 TRACE 스크립트로 컨트롤파일을 재생성하여 디비를 MOUNT 시킵니다.
v$datafile_header를 조회해보면 모든 파일의 FUZZY 상태가 YES입니다. v$backup을 조회해보면 상태가 ACTIVE이며 BEGIN BACKUP 시각이 찍혀있어 명확히 핫 백업본임을 확정 짓습니다.
이 일관성이 깨진 상태로 무작정 디비를 열어보면, 오라클이 ORA-01195 에러를 뿜으며 일관성(Consistent)을 맞추기 위한 리두 적용이 더 필요하다며 강력히 거부합니다.
오라클의 요구대로 RECOVER DATABASE를 치면 시퀀스 1번 아카이브를 달라고 요청하지만(ORA-00279), 파일이 삭제되어 없으므로(ORA-00308) 적용할 방법이 없습니다. 
CANCEL을 쳐서 복구를 포기하면, 오라클이 친절하게 "복구는 끝났지만 지금 RESETLOGS를 치면 ORA-01195 에러 날 거다"라고 경고(ORA-01547)까지 해줍니다.
경고를 무시하고 억지로 열어보아도 역시나 똑같은 에러로 실패합니다.
```