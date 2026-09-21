```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL destination FOR a20
COL error FOR a40
COL member FOR a44

SELECT MIN(sequence#) AS oldest, MAX(sequence#) AS newest, COUNT(*) AS cnt,
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

CREATE TABLE hr.emp114(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp114 VALUES (1, 'archived ok');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

실습 11-3을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
현재 아카이브 로그 뷰를 조회하여 이전 실습에서 버렸던 구간(시퀀스 3번)을 제외하고는 아카이브가 정상적으로 연속성을 띄고 있음을 확인합니다.
아카이브 대상 경로(v$archive_dest)가 정상(VALID)인지 점검한 후, 테스트용 테이블을 만들고 데이터를 넣어 정상적으로 아카이브가 떨어지는 베이스라인을 구축합니다.

**장애 유발**
!\chmod 500 /arch1

INSERT INTO hr.emp114 VALUES (2, 'not archived');

COMMIT;

ALTER SYSTEM SWITCH LOGFILE;

INSERT INTO hr.emp114 VALUES (3, 'also not archived');

COMMIT;

ALTER SYSTEM SWITCH LOGFILE;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

ALTER SYSTEM CHECKPOINT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\rm -f /u02/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

아카이브가 떨어지는 것을 물리적으로 막기 위해 회원님의 실제 아카이브 경로(/arch1)의 권한을 500으로 변경합니다.
데이터를 삽입하고 리두 스위치를 두 번 발생시켜 고의로 아카이브가 밀리도록(ARCHIVED=NO) 유도합니다.
이후 체크포인트를 발생시켜 밀려있는 리두 그룹들을 ACTIVE에서 INACTIVE 상태로 전환시킵니다. (ACTIVE 상태일 때는 파일이 전손되어도 CLEAR UNARCHIVED로 비울 수 없기 때문입니다.)
그 상태에서 운영체제 레벨에서 1번 리두 그룹의 파일들을 통째로 삭제하여 장애 상황을 완성합니다.

**진단**
SELECT group#, member, status FROM v$logfile WHERE group# = 1;

SELECT dest_id, destination, status, error FROM v$archive_dest
  WHERE  destination IS NOT NULL;

!\ls -ld /arch1

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

v$logfile을 조회하면 파일 존재 여부를 체크하지 않으므로 상태가 비어있습니다.
v$archive_dest를 조회하면 아카이브 경로(/arch1) 권한 문제로 인해 ORA-19504 에러가 발생해 대상이 ERROR 상태로 떨어져 있음을 알 수 있습니다.
v$log를 보면 그룹 1, 3, 4번 모두 ARCHIVED가 NO로 아카이브가 완전히 막혀있습니다.
진단 결과: 현재 아카이브가 안 되는 원인은 두 가지입니다. 그룹 3, 4번은 대상 권한 문제 때문이고(파일은 멀쩡함), 그룹 1번은 파일 자체가 삭제되어 원본이 없기 때문입니다. 따라서 대상을 먼저 고치고 살릴 수 있는 그룹은 살려야 합니다.

**복구 절차 (잘못된 접근 및 수정)**
ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;

SELECT MIN(sequence#) AS oldest, MAX(sequence#) AS newest, COUNT(*) AS cnt,
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

!\chmod 700 /arch1

ALTER SYSTEM ARCHIVE LOG ALL;

SELECT dest_id, status, error, reopen_secs FROM v$archive_dest WHERE dest_id = 1;

ALTER SYSTEM SET log_archive_dest_state_1 = ENABLE;

SELECT dest_id, status, error FROM v$archive_dest WHERE dest_id = 1;

ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 1;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

[잘못된 접근]
ARCHIVED가 NO라는 이유만으로 무작정 `CLEAR UNARCHIVED` 옵션을 날려 그룹 3번(파일이 멀쩡한 상태)을 비워버리는 치명적인 실수를 시뮬레이션합니다. 그 결과 살릴 수 있었던 시퀀스 8번 구간의 리두 데이터를 억울하게 영구 손실하게 됩니다.

[올바른 조치 및 수정]
정신을 차리고 아카이브 경로(/arch1)의 권한을 원래대로(700) 복구합니다.
밀린 아카이브를 강제로 밀어내기 위해 `ARCHIVE LOG ALL`을 치면, 파일이 전손된 그룹 1번(시퀀스 7번)에서 막히며 ORA-00313 에러가 떨어집니다.
대상을 고쳐도 상태가 즉각 반영되지 않기 때문에 파라미터(`log_archive_dest_state_1 = ENABLE`)를 리셋해주어 v$archive_dest 상태를 VALID로 되돌립니다.
그 후 파일이 없어 아카이브가 절대 불가능한 것이 100% 증명된 그룹 1번에만 정당하게 `CLEAR UNARCHIVED` 옵션을 사용하여 리두를 비워줍니다.

**디비 오픈 및 검증**
ALTER SYSTEM SWITCH LOGFILE;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT MIN(sequence#) AS oldest, MAX(sequence#) AS newest, COUNT(*) AS cnt,
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

SELECT sequence#, status FROM v$archived_log
  WHERE  resetlogs_change# = (SELECT resetlogs_change# FROM v$database)
  ORDER BY sequence#;

SELECT COUNT(*) FROM hr.emp114;

SELECT dest_id, status, error FROM v$archive_dest WHERE dest_id = 1;
```