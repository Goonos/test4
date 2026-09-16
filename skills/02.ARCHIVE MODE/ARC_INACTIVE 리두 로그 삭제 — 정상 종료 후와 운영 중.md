```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL member FOR a44

SELECT l.group#, l.sequence#, l.archived, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.group#;

SELECT COUNT(*) FROM hr.emp106;

실습 10-6을 마친 상태에서 리두 로그 관리를 위한 환경 설정을 진행합니다.
v$log와 v$logfile 뷰를 조인하여 현재 시스템의 리두 로그 그룹(1, 3, 4번)과 회원님의 실제 경로(/u02/oradata/orcl/ 등)에 매핑된 멤버들의 상태(CURRENT, INACTIVE 등) 및 아카이브 여부(ARC)를 파악합니다.
이전 실습에서 복구했던 hr.emp106 테이블의 데이터(2건)가 온전히 유지되고 있는지 확인합니다.

**장애 유발**
ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SHUTDOWN IMMEDIATE

!\rm -f /u02/oradata/orcl/redo04.log /u02/oradata/orcl/redo04b.log

STARTUP

아카이브를 강제로 발생시켜 모든 INACTIVE 그룹의 아카이브 상태를 YES로 만듭니다.
데이터베이스를 정상 종료(SHUTDOWN IMMEDIATE)한 뒤, 운영체제 레벨에서 회원님의 실제 경로에 있는 그룹 4번의 모든 멤버 파일들을 강제 삭제하여 전손 장애를 유발합니다.
다시 STARTUP을 시도하면 삭제된 4번 그룹 파일들을 찾지 못해 ORA-00313, ORA-00312 에러를 뿜으며 데이터베이스 오픈이 중단됩니다.


**진단 및 첫 번째 경우 처리**
SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT sequence#, name FROM v$archived_log WHERE sequence# = 2;

ALTER DATABASE CLEAR LOGFILE GROUP 4;

SELECT group#, sequence#, status FROM v$log WHERE group# = 4;

SELECT member, status FROM v$logfile WHERE group# = 4;

ALTER DATABASE OPEN;

SELECT COUNT(*) FROM hr.emp106;

에러가 발생한 마운트 상태에서 리두 그룹의 상태를 조회해보면, 파일이 지워진 그룹 4번은 INACTIVE 상태이고 ARCHIVED가 YES임을 확인할 수 있습니다.
이는 그룹 4번이 가지고 있던 리두 데이터가 이미 아카이브 로그 파일로 안전하게 백업되었음을 의미하므로, 단순히 ALTER DATABASE CLEAR LOGFILE 명령을 내려 손실 없이 리두 로그를 초기화(재생성)할 수 있습니다.
초기화 후 그룹 4번은 UNUSED 상태로 깔끔하게 정리되며, 회원님의 디스크 경로에 파일이 다시 생성되어 정상적으로 데이터베이스가 오픈됩니다. 커밋된 데이터(2건)도 완벽히 보존됩니다.

**진단 및 두 번째 경우 조건 만들기 (운영 중 유실)**
!\chmod 500 /arch1

INSERT INTO hr.emp106 VALUES (3, 'before switch');

COMMIT;

ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM SWITCH LOGFILE;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\rm -f /u02/oradata/orcl/redo03.log /u02/oradata/orcl/redo03b.log

SELECT group#, member, status FROM v$logfile WHERE group# = 3;

회원님의 실제 아카이브 경로인 /arch1 디렉터리의 권한을 500(읽기/실행만 가능, 쓰기 불가)으로 변경하여 일부러 아카이브 저장을 방해합니다.
데이터를 삽입하고 리두 스위치를 여러 번 발생시켜 아카이브가 밀리도록 유도한 뒤 상태를 조회해 보면, 모든 그룹의 ARCHIVED 상태가 NO인 것을 확인할 수 있습니다.
이 상태에서 디비가 켜져 있는 운영 중에 그룹 3번의 멤버들을 강제로 지워버립니다. v$logfile을 조회하면 파일이 없어 INVALID 상태로 떨어집니다.

**복구 절차 (원인 파악 및 수정)**
ALTER DATABASE CLEAR LOGFILE GROUP 3;

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

!\ls -ld /arch1

!\chmod 700 /arch1

ALTER SYSTEM ARCHIVE LOG ALL;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

단순히 CLEAR 명령을 내리면 아직 아카이브가 되지 않았다며 거부(ORA-00350)당합니다.
습관적으로 UNARCHIVED 옵션을 붙이기 전에 v$archive_dest 뷰를 통해 권한 문제(ORA-19504)로 아카이브가 밀렸음을 정확히 진단합니다.
디렉터리 권한을 700으로 복구하고 밀린 아카이브를 수동으로 밀어냅니다(ARCHIVE LOG ALL). 
파일이 남아있던 그룹 1번과 4번은 정상적으로 아카이브되어 상태가 YES로 바뀌지만, 이미 삭제된 그룹 3번만 ORA-16038 에러를 내며 NO 상태로 남게 됩니다.
아카이브할 원본 파일이 완벽히 전손된 것이 확정되었으므로, 오직 그룹 3번에만 UNARCHIVED 옵션을 주어 리두를 포기하고 강제 초기화시킵니다.
```