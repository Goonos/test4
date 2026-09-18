```sql
-- BCT를 켜지 않은 상태의 증분 백업 읽기량을 먼저 측정한다.
-- BCT를 활성화하고 같은 변경량으로 다시 측정해 비교한다.
-- 활성화 직후 첫 증분이 전체를 읽는다는 점을 확인한다.
-- BCT 파일을 잃었을 때의 동작과 복구 방법을 확인한다.
-- 작업 유형 : 백업 최적화(장애 복구 아님)

**사전 조건**
ALTER DATABASE DISABLE BLOCK CHANGE TRACKING;
끄는 방법


[세션: SQL*Plus (SYSDBA)]
SELECT status, filename FROM v$block_change_tracking;

현재 BCT(Block Change Tracking) 기능이 활성화(ENABLED)되어 있는지, 그리고 추적 파일의 경로는 어디인지 상태를 먼저 확인합니다. 현재는 'DISABLED' 상태입니다.

SELECT COUNT(*) FROM hr.incr_test;

**초기 상태 확인 : BCT 없이 증분 백업**
[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('d', 2000, 'd') WHERE id <= 200;
COMMIT;

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'NO_BCT';

[세션: SQL*Plus (SYSDBA)]
SELECT file#, incremental_level AS lv, blocks, blocks_read, datafile_blocks,
       ROUND(blocks_read/datafile_blocks, 2) AS read_ratio
FROM   v$backup_datafile
WHERE  file# = 5 AND incremental_level = 1
ORDER  BY completion_time DESC FETCH FIRST 1 ROWS ONLY;
BCT 기능이 꺼져 있을 때 증분 백업의 I/O 읽기량을 측정합니다. 담아야 할 변경 블록(blocks)은 68개뿐이지만, 변경된 블록을 찾기 위해 쓰인 적 있는 전체 블록(blocks_read = 896)을 모두 스캔하여 읽었음을 확인할 수 있습니다. 증분 백업이 크기만 줄었을 뿐 읽기 부하는 전체 백업과 동일하게 발생합니다.

**작업 수행 : BCT 활성화**
[세션: SQL*Plus (SYSDBA)]
ALTER DATABASE ENABLE BLOCK CHANGE TRACKING USING FILE '/u02/oradata/orcl/bct_orcl.chg' REUSE;
블록 변경 추적(BCT) 기능을 활성화하고 추적 파일의 생성 경로를 지정합니다.

SELECT status, filename, bytes/1024/1024 AS mb FROM v$block_change_tracking;

[세션: Linux OS Shell]
ls -l /u02/oradata/orcl/bct_orcl.chg
생성된 BCT 파일의 물리적인 크기(기본 약 11MB)를 확인합니다.

**진행 로그 : 활성화 직후 첫 증분**
[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('e', 2000, 'e') WHERE id BETWEEN 201 AND 400;
COMMIT;

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'BCT_FIRST';

[세션: Linux OS Shell]
sqlplus -s / as sysdba <<< \
SELECT blocks, blocks_read, ROUND(blocks_read/datafile_blocks,2) AS ratio
 FROM v$backup_datafile WHERE file#=5 AND incremental_level=1
 ORDER BY completion_time DESC FETCH FIRST 1 ROWS ONLY;
BCT 활성화 직후 수행한 첫 번째 증분 백업의 결과를 확인합니다. BCT를 켰지만 여전히 896블록 전체를 읽은 것으로 나옵니다. 활성화 직후에는 기준이 되는 과거 Level 0 시점의 추적 데이터가 내부에 없기 때문에, 어쩔 수 없이 첫 증분 시점에는 파일 전체를 스캔하여 추적 정보를 수집해야 하기 때문입니다.

**진행 로그 : Level 0 이후 효과 확인**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 0 TABLESPACE tbs13 TAG 'L0_AFTER_BCT';
BCT가 활성화된 상태에서 새롭게 증분 백업의 기준점이 될 Level 0 백업을 받아 추적 베이스라인을 확립합니다.

[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('f', 2000, 'f') WHERE id BETWEEN 401 AND 600;
COMMIT;

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'BCT_ON';

[세션: SQL*Plus (SYSDBA)]
SELECT TO_CHAR(completion_time,'HH24:MI') AS done, blocks, blocks_read,
       ROUND(blocks_read/datafile_blocks, 2) AS read_ratio
FROM   v$backup_datafile
WHERE  file# = 5 AND incremental_level = 1
ORDER  BY completion_time DESC FETCH FIRST 3 ROWS ONLY;
Level 0 백업 이후 다시 수행한 Level 1 증분 백업의 결과를 확인합니다. 읽은 블록(blocks_read)이 기존 896개에서 125개로 급격히 줄어들었습니다. BCT가 변경된 블록의 위치를 정확히 알고 있어 전체를 읽지 않고 필요한 부분만 읽게 되어 I/O 부하가 획기적으로 개선되었음을 증명합니다.

**오류 발생 → 원인 파악 → 수정**
[세션: SQLPlus (SYSDBA)]
!rm -f /u02/oradata/orcl/bct_orcl.chg
SQLPlus 프롬프트에서 !(호스트 명령어 실행)를 이용하여 OS 차원에서 BCT 파일을 임의로 강제 삭제합니다. 디스크 장애 상황을 시뮬레이션합니다.

SELECT status FROM v$block_change_tracking;
BCT 파일을 조회하는 순간 파일이 없으므로 ORA-19755, ORA-19750, Linux Error: 2 등의 오류가 즉각 발생하며 문제가 드러납니다.

UPDATE hr.incr_test SET pad = RPAD('x', 2000, 'x') WHERE id BETWEEN 601 AND 650;
COMMIT;

SHUTDOWN IMMEDIATE
데이터베이스 종료를 시도하지만, 종료 과정 중 LGWR 프로세스가 BCT 파일을 정상적으로 정리하고 닫으려 할 때 파일이 없어 ORA-19755 에러를 발생시키며 인스턴스를 강제로 비정상 종료(Abort)시킵니다. 클라이언트 화면에는 뜬금없는 ORA-03113: end-of-file on communication channel 만 나타납니다.

!tail -12 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log
Alert 로그의 마지막 부분을 출력하여, 비정상 종료의 진짜 원인이 BCT 파일 유실(ORA-19755) 때문임을 파악합니다.

STARTUP
인스턴스를 재기동합니다. 오라클은 기동 시점에 BCT 파일이 존재하지 않으면 설정된 경로에 파일을 자동으로 새로 생성하며 복구합니다.

SELECT status, filename FROM v$block_change_tracking;

!ls -l /u02/oradata/orcl/bct_orcl.chg
```