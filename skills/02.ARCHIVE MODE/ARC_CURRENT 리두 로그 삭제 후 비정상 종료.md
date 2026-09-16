```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT checkpoint_change# FROM v$database;

INSERT INTO hr.emp111 VALUES (3, 'archived');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS switch_time FROM dual;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT MAX(sequence#) AS archived_max FROM v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

실습 11-1을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
테스트용 테이블에 3번 데이터를 추가한 뒤 아카이브 로그를 생성하여 리두 로그 스위치를 발생시킵니다.
이때 마지막으로 스위치가 일어난 시각을 기록해두고, v$log를 조회하여 현재 CURRENT 그룹이 아카이브 되지 않은 상태(ARCHIVED=NO)임을 확인합니다.
v$archived_log를 통해 현재 인카네이션에서 아카이브가 완료된 마지막 시퀀스 번호를 기록해둡니다.

**장애 유발**
INSERT INTO hr.emp111 VALUES (4, 'in current only');

COMMIT;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS commit_time FROM dual;

SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/redo03.log /u02/oradata/orcl/redo03b.log

아카이브 되지 않은 CURRENT 리두 로그 그룹에만 데이터가 저장되도록 4번 데이터를 입력하고 커밋합니다.
커밋 시각을 기록한 뒤, 이전 실습(정상 종료)과 정반대로 비정상 종료(SHUTDOWN ABORT)를 수행하여 버퍼 캐시의 내용을 데이터파일에 내려쓰지(체크포인트) 않고 인스턴스를 강제로 죽입니다.
그 상태에서 운영체제 레벨에서 회원님의 경로에 있는 CURRENT 그룹(3번) 멤버들을 통째로 삭제해 버려 장애를 유발합니다.

**진단**
STARTUP

SELECT status FROM v$instance;

!\grep -n 'Beginning crash recovery\|ORA-313 signalled' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -2

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

COL member FOR a44

SELECT group#, member, status FROM v$logfile WHERE group# = 3;

!\grep -n 'instance (abort)' \
        /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

SELECT sequence#, first_change#, next_change#,
            TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
  FROM  v$log_history
  WHERE  resetlogs_change# = (SELECT resetlogs_change# FROM v$database)
  ORDER BY sequence# DESC FETCH FIRST 3 ROWS ONLY;

데이터베이스를 올리면 이전 실습과 달리 인스턴스가 죽지 않고 MOUNT 상태에서 멈춥니다.
Alert 로그를 보면 크래시 복구(Crash recovery)를 시도하다가 삭제된 그룹 3번 리두 파일을 찾지 못해 ORA-00313 에러를 뿜고 실패했음을 알 수 있습니다.
v$log에서 문제의 그룹이 CURRENT 상태임을 확인하고, Alert 로그에서 직전 종료가 비정상 종료(abort)였음을 교차 검증합니다.
결정적으로 v$datafile_header에서 모든 파일의 FUZZY 상태가 YES인 것을 확인합니다. 이는 데이터파일에 반영되지 않은 변경사항이 리두 로그에 남아있다는 뜻인데, 그 리두 로그가 방금 전손되었고 아카이브 사본마저 없으므로 11-1과 달리 불완전 복구(데이터 손실)가 확정되었음을 판정합니다.

**복구 절차**
ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;

ALTER DATABASE OPEN RESETLOGS;

SELECT file#, error, change# FROM v$recover_file;

SHUTDOWN ABORT

!\cp -p /fra/backup/cold/20260914_154500/ *.dbf /u02/oradata/orcl/

STARTUP MOUNT

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

SET AUTORECOVERY OFF

RECOVER DATABASE UNTIL CANCEL;

SELECT checkpoint_change#, TO_CHAR(checkpoint_time, 'HH24:MI:SS') AS stopped_at
  FROM  v$datafile_header WHERE file# = 1;

이전 실습처럼 UNARCHIVED로 리두 그룹 초기화를 시도해보지만, 인스턴스 크래시 복구에 필요한 리두를 담고 있기 때문에 오라클이 초기화를 강력히 거부(ORA-01624)합니다. 
과거 백업본으로 전체 데이터파일을 덮어써서 복원하고, MOUNT 단계로 올린 후 파일의 FUZZY 상태가 NO인 것을 확인합니다.
수동(UNTIL CANCEL) 복구를 시작하여 아카이브가 남아있는 마지막 시퀀스까지만 리두를 적용하고, 전손되어 사본이 없는 CURRENT 그룹 시퀀스를 오라클이 요구할 때 CANCEL을 입력해 복구를 강제 종료시킵니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;

복구를 마친 뒤 새로운 인카네이션(세계선)을 열기 위해 데이터베이스를 RESETLOGS 옵션으로 오픈합니다.
```