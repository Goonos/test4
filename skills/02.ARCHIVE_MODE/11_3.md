```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL member FOR a44

CREATE TABLE hr.emp113(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp113 VALUES (1, 'running');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT l.group#, l.sequence#, l.archived, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.group#;

실습 11-2를 마친 상태에서 리두 로그 관리를 위한 환경을 세팅합니다.
데이터베이스가 정상 운영 중인 상태(OPEN)를 시뮬레이션하기 위해 hr.emp113 테이블을 만들고 1번 데이터를 넣은 후 아카이브 로그를 발생시킵니다.
v$log와 v$logfile 뷰를 통해 현재 3번 그룹이 CURRENT 상태임을 확인합니다.

**장애 유발 (멤버 하나 삭제 및 정상 서비스 확인)**
!\rm -f /u02/oradata/orcl/redo03b.log

INSERT INTO hr.emp113 VALUES (2, 'one member lost');

COMMIT;

SELECT group#, member, status FROM v$logfile WHERE group# = 3;

!\grep -n -A3 'orcl_lg00' \
          /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -4

ALTER SYSTEM SWITCH LOGFILE;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

ALTER DATABASE DROP LOGFILE MEMBER '/u02/oradata/orcl/redo03b.log';

ALTER DATABASE ADD LOGFILE MEMBER '/u02/oradata/orcl/redo03b.log' TO GROUP 3;

SELECT group#, member, status FROM v$logfile WHERE group# = 3;

운영체제 레벨에서 3번 그룹의 멤버 중 하나(redo03b.log)를 삭제합니다.
멤버가 지워졌음에도 2번 데이터 입력과 커밋이 정상적으로 수행됩니다. 이는 멤버 하나가 손상되어도 LGWR 프로세스가 다중화된 나머지 멤버(redo03.log)에 기록을 계속하여 서비스가 유지되기 때문입니다.
Alert 로그를 보면 LGWR 작업 프로세스가 지워진 파일을 열려다 실패한 기록(ORA-27041)이 남아있습니다. 
올바른 조치를 위해 스위치(SWITCH LOGFILE)를 일으켜 3번 그룹을 비우고(ACTIVE/INACTIVE 상태로 전환), DROP/ADD 명령어를 사용해 손상된 멤버를 깔끔하게 교체합니다. 새 멤버는 처음 사용될 때까지 INVALID로 표시되다 순환이 돌아오면 정상이 됩니다.

**장애 유발 (CURRENT 그룹 전손 및 운영 상태 확인)**
!\rm -f /u02/oradata/orcl/redo04.log /u02/oradata/orcl/redo04b.log

INSERT INTO hr.emp113 VALUES (3, 'all members lost');

COMMIT;

ALTER SYSTEM SWITCH LOGFILE;

SELECT COUNT(*) FROM hr.emp113;

SELECT status FROM v$instance;

이번에는 그룹 4번의 모든 멤버 파일을 동시에 삭제하여 전손 장애를 발생시킵니다.
멤버가 모두 삭제되었음에도 불구하고 3번 데이터를 입력하고 커밋하며 스위치까지 정상적으로 넘어갑니다. 디비 상태도 OPEN으로 살아있습니다. 
이는 리눅스의 특징 때문인데, 파일이 삭제되더라도 LGWR 프로세스가 이미 쥐고 있는 파일 핸들(메모리 상의 연결점)을 놓지 않기 때문에 그 핸들을 통해 디스크에 계속 쓰고 있는 것입니다.

**진단**
SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\grep -n 'ORA-00313' \
          /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

COL error FOR a40

SELECT dest_id, status, error FROM v$archive_dest WHERE dest_id = 1;

스위치가 넘어가 그룹 1번이 CURRENT가 되었고, 방금 전손된 그룹 4번은 ACTIVE 상태이지만 ARCHIVED가 NO 상태로 아카이브가 밀려있습니다. 
LGWR는 핸들로 기록할 수 있지만 아카이버(ARCn)는 파일 이름으로 열어서 복사해야 하므로 실체가 사라진 4번 그룹을 아카이브 하지 못하는 것입니다. (Alert 로그에 ORA-00313 기록됨)
아카이브 경로(v$archive_dest)는 정상(VALID)이므로 파일 부재가 원인임이 확정되었습니다.
이 상태로 방치하면 리두 순환이 다시 4번 차례에 올 때 디비가 멈춰버리고, 디비를 재기동해버리면 핸들이 날아가 크래시 복구 실패로 불완전 복구(데이터 손실)를 피할 수 없게 됩니다. 따라서 인스턴스가 살아있는 지금 즉시 대응해야 합니다.

**복구 절차**
ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 4;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\ls -l /u02/oradata/orcl/redo04.log /u02/oradata/orcl/redo04b.log

SELECT COUNT(*) FROM hr.emp113;

ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM ARCHIVE LOG CURRENT;

인스턴스가 살아있는 상태에서는 ACTIVE 그룹도 비울 수 있습니다(오라클이 내부적으로 체크포인트를 수행하고 비움).
ALTER DATABASE CLEAR UNARCHIVED 명령을 날려 그룹 4번의 리두와 아카이브를 포기하고 강제로 초기화(UNUSED) 시킵니다.
초기화 후 회원님의 디스크 경로에 파일이 재생성된 것을 확인합니다.
그룹 4번을 비웠지만, 기록되었던 3번 데이터는 인스턴스가 살아있는 동안 이미 버퍼 캐시를 거쳐 데이터파일에 안전하게 반영되었으므로 3건이 유실 없이 그대로 유지됩니다.

```