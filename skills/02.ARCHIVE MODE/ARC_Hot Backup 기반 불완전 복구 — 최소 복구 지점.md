```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS backup_start FROM dual;

!\rm -rf /fra/backup/hotbackup && \mkdir -p /fra/backup/hotbackup

ALTER DATABASE BEGIN BACKUP;

SELECT file#, status, change#,
            TO_CHAR(time, 'HH24:MI:SS') AS t FROM v$backup WHERE status = 'ACTIVE';

INSERT INTO hr.emp104 VALUES (11, 'during backup');

COMMIT;

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/hotbackup/

!\rm -f /fra/backup/hotbackup/temp01.dbf

INSERT INTO hr.emp104 VALUES (12, 'during backup 2');

COMMIT;

ALTER DATABASE END BACKUP;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS backup_end FROM dual;

ALTER SYSTEM ARCHIVE LOG CURRENT;

실습 10-4를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
이번 실습은 콜드 백업이 아닌 핫 백업(Hot Backup) 기반의 복구이므로, ALTER DATABASE BEGIN BACKUP을 수행하여 백업 모드로 진입합니다.
백업 도중에도 데이터 변경이 가능함을 시뮬레이션하기 위해 11번, 12번 데이터를 INSERT하고, 회원님의 실제 경로인 /u02/oradata/orcl/의 데이터파일들을 /fra/backup/hotbackup/ 으로 복사합니다.
파일 복사가 끝나면 END BACKUP을 수행하여 백업 모드를 종료하고 아카이브 로그를 생성합니다. 이때 백업 시작과 종료 시각을 기록해 둡니다.

**장애 유발**
INSERT INTO hr.emp104 VALUES (13, 'after backup');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS now FROM dual;

DELETE FROM hr.emp104 WHERE id <= 2;

COMMIT;

SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS accident FROM dual;

ALTER SYSTEM ARCHIVE LOG CURRENT;

백업이 끝난 후 정상적인 업무(13번 데이터 INSERT)가 진행됩니다.
이후 사용자의 치명적인 실수로 1번과 2번 데이터를 조건절로 지워버리는 DELETE 작업을 수행하고 커밋합니다. 사고가 발생한 시각을 기록하고 아카이브 로그를 강제로 내려씁니다.

**진단**
SELECT id, memo FROM hr.emp104 ORDER BY id;

SELECT sequence#, first_change#, next_change#,
            TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
  FROM  v$log_history ORDER BY sequence# DESC FETCH FIRST 4 ROWS ONLY;

!\ls -l /fra/backup/hotbackup/ *.dbf | wc -l

SELECT MIN(sequence#), MAX(sequence#), COUNT(*),
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log WHERE status = 'A';

!\mkdir -p /fra/backup/cold/20260912_before_105

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260912_before_105/

테이블을 조회하여 실수로 1, 2번 데이터가 삭제된 것을 확인하고, 사고 직전 시각으로 되돌려야 함을 파악합니다.
핫 백업은 백업이 진행되는 동안 파일이 복사되므로, 파일마다 SCN이 다르고 일관성이 없는 FUZZY 블록이 섞이게 됩니다. 따라서 백업이 진행된 구간(BEGIN ~ END) 안의 특정 시점으로는 절대 복구 지점을 잡을 수 없다는 최소 복구 지점 제약이 있습니다.
하지만 우리의 목표 시점은 END BACKUP 시점보다 미래이기 때문에 해당 핫 백업 세트를 사용하여 복구가 가능함을 판정하고 현재 상태를 임시 백업해 둡니다.

**복구 절차**
SHUTDOWN IMMEDIATE

STARTUP MOUNT

!\cp -p /fra/backup/hotbackup/ *.dbf /u02/oradata/orcl/

SELECT file#, checkpoint_change#,
            TO_CHAR(checkpoint_time, 'HH24:MI:SS') AS ckpt_time, fuzzy
  FROM  v$datafile_header ORDER BY file#;

RECOVER DATABASE UNTIL TIME '2026-09-11 13:05:00';

ALTER DATABASE OPEN RESETLOGS;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

RECOVER DATABASE UNTIL TIME '2026-09-11 13:18:00';

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

데이터베이스를 내리고 핫 백업 경로의 백업본을 덮어써 복원합니다.
v$datafile_header를 조회해보면 백업 중 복사된 파일들이라 FUZZY 상태가 YES로 되어 있어 일관성이 없음을 확인할 수 있습니다.
최소 복구 지점의 제약을 눈으로 확인하기 위해 고의로 백업 구간 내부의 시각(13:05:00)을 목표로 복구를 지시해 봅니다. 복구 완료 메시지가 출력되지만, RESETLOGS로 오픈을 시도하면 데이터파일이 일관성에 도달하지 못해 오픈이 거부되는 핵심 현상을 확인합니다.
파일을 다시 덮어쓸 필요 없이, 올바른 목표 지점인 사고 직전 시각(13:18:00)을 향해 이어서 복구를 진행합니다.
복구 완료 후 v$datafile_header를 다시 조회하면 드디어 FUZZY 상태가 NO로 변해 데이터파일의 완벽한 일관성이 확보되었음을 증명합니다.

**디비 오픈**
ALTER DATABASE OPEN READ ONLY;

SELECT id, memo FROM hr.emp104 ORDER BY id;

SHUTDOWN IMMEDIATE

STARTUP MOUNT

ALTER DATABASE OPEN RESETLOGS;

READ ONLY로 데이터베이스를 오픈하여 실수로 삭제했던 1, 2번 데이터가 살아났고, 핫 백업 도중과 이후에 입력된 11, 12, 13번 데이터도 안전하게 보존되었음을 확인합니다.
검증 후 데이터베이스를 내려 마운트 상태에서 RESETLOGS 옵션으로 오픈합니다.
```