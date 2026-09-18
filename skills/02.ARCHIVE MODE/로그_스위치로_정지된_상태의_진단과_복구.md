```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL destination FOR a20
COL error FOR a30
COL member FOR a44

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

SELECT process, status, log_sequence, state FROM v$archive_processes
  WHERE  status <> 'STOPPED';

CREATE TABLE hr.emp125(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp125 VALUES (1, 'normal');

COMMIT;

실습 12-4를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
현재 리두 로그 그룹의 상태(1, 3번 INACTIVE / 4번 CURRENT)를 확인하고, 회원님의 아카이브 대상 경로(/fra/backup 등)가 정상(VALID)인지 점검합니다. 
아카이버 프로세스(ARCn)들이 모두 IDLE 상태로 대기 중인지 확인한 후, 테스트 테이블을 만들어 정상적인 데이터를 입력해 둡니다. 이번 실습은 디비가 열려있는(OPEN) 상태에서 진행됩니다.

**장애 유발 (멤버 삭제 후 스위치 진행)**
!\rm -f /u01/app/oracle/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM SWITCH LOGFILE;

INSERT INTO hr.emp125 VALUES (2, 'after switch');

COMMIT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM SWITCH LOGFILE;
-- 세션 대기 발생 (응답 없음)

운영체제 레벨에서 1번 리두 그룹의 멤버들을 모두 강제 삭제합니다.
리눅스는 열려있는 파일 핸들을 유지하므로 삭제 직후에는 아무런 증상이 없습니다. 스위치를 2번 돌려 1번 그룹을 한 바퀴 순환시키고 데이터를 넣어도 에러 없이 정상적으로 커밋됩니다.
하지만 v$log를 조회해보면 방금 한 바퀴 돌았던 1번 그룹(시퀀스 4)이 여전히 ARCHIVED NO 상태로 남아있습니다. 아카이버 프로세스는 파일 이름으로 접근하는데 파일이 없어 아카이브에 실패한 것입니다.
이 상태에서 스위치를 더 돌려 순환 차례가 다시 1번 그룹으로 돌아오면, 다음 리두를 할당하지 못해 세션이 멈추고 멍을 때리는(응답 없음) 행업 상태에 빠집니다.

**증상 관찰**
-- 새로운 진단용 터미널 세션 오픈
SELECT status, database_status FROM v$instance;

SELECT event, COUNT(*) FROM v$session
  WHERE  wait_class <> 'Idle' GROUP BY event ORDER BY 2 DESC;

진단용 세션(새 창)을 열어 데이터베이스 상태를 확인해 보면 인스턴스는 멀쩡히 OPEN 상태로 살아있습니다.
v$session 뷰를 통해 대기 이벤트(wait event)를 조회해 보면 `switch logfile command` 혹은 `log file switch (archiving needed)` 이벤트가 최상단에 떠 있으며, 세션들이 리두 스위치를 기다리며 무한 대기 중인 것을 명확히 관찰합니다.

**진단**
!\tail -20 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

!\df -h /arch1

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\ls -l /u01/app/oracle/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

행업의 원인이 아카이브 용량 꽉 참 문제인지, 리두 파일 손상 문제인지 구분해야 합니다.
Alert 로그를 보면 리두 파일을 열 수 없다(ORA-00312, ORA-00313)는 에러와 함께 `All online logs need archiving` 메시지가 떠 있어 리두 파일 쪽 문제임이 유력합니다.
교차 검증을 위해 v$archive_dest 뷰와 리눅스 df 명령어로 아카이브 경로와 남은 용량을 확인해 보면 넉넉하게 남아있어 용량 문제가 아님을 확정합니다.
v$log를 보면 1번 그룹에서 막혀 그 뒤의 그룹들까지 줄줄이 아카이브가 밀려(ARCHIVED NO) 있음을 확인합니다.
진단 결론: 용량 문제가 아니라 1번 리두 로그 그룹의 멤버들이 전손되어 아카이브를 할 원본 파일이 없어진 것이 원인입니다. 해결책은 원본이 없는 1번 그룹의 아카이브를 강제로 포기(UNARCHIVED)시키는 것입니다.

**복구 절차**
ALTER SYSTEM ARCHIVE LOG ALL;

ALTER DATABASE CLEAR LOGFILE GROUP 1;

ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 1;
-- 멈춰있던 첫 번째 세션의 스위치 명령이 즉시 완료됨

ALTER SYSTEM SWITCH LOGFILE;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

혹시 몰라 아카이브를 수동으로 밀어내려 시도(ARCHIVE LOG ALL)해보지만 당연히 파일이 없어(ORA-00313) 실패합니다.
단순 CLEAR 명령도 아직 아카이브 되지 않았다며 거부(ORA-00350) 당합니다.
원인이 파일 전손으로 100% 명확하므로 `CLEAR UNARCHIVED` 옵션을 주어 1번 그룹을 강제로 초기화시킵니다. (만약 1번이 ACTIVE 상태라면 먼저 `ALTER SYSTEM CHECKPOINT`로 INACTIVE로 내려야 합니다.)
명령이 떨어지는 순간 꽉 막혀있던 리두 체증이 확 뚫리며, 멈춰있던 첫 번째 세션의 스위치 명령이 즉각적으로 처리됩니다.
v$log를 조회해보면 초기화된 1번 그룹이 CURRENT가 되고, 뒤로 꽉 밀려있던 그룹들도 아카이버가 즉시 처리하여 순식간에 아카이브가 완료(YES)됩니다.

**디비 오픈**
SELECT group#, member, status FROM v$logfile ORDER BY group#;

!\ls -l /u01/app/oracle/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

SELECT event, COUNT(*) FROM v$session
  WHERE  wait_class <> 'Idle' GROUP BY event;

SELECT id, memo FROM hr.emp125 ORDER BY id;

!\grep -A1 'CLEARING REDO LOG' /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -2

ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM ARCHIVE LOG CURRENT;
```