```sql
초기 상태 확인
SELECT name, log_mode, open_mode FROM v$database;

SELECT name FROM v$datafile
UNION ALL SELECT name FROM v$controlfile
UNION ALL SELECT member FROM v$logfile;

ALTER SYSTEM CHECKPOINT;
SELECT checkpoint_change# FROM v$database;
SELECT file#, checkpoint_change#, status FROM v$datafile ORDER BY file#;

SHUTDOWN IMMEDIATE

스크립트만들기
SELECT 'cp -p ' || name || ' /home/oracle/backup/cold/' FROM v$datafile
UNION ALL
SELECT 'cp -p ' || name || ' /home/oracle/backup/cold/' FROM v$controlfile
UNION ALL
SELECT 'cp -p ' || member || ' /home/oracle/backup/cold/' FROM v$logfile;
의 결과물 sh로 저장 후 실행
sh cold_backup.sh

!ls -l /u02/oradata/orcl/system01.dbf /home/oracle/backup/cold/system01.dbf

CREATE PFILE='/home/oracle/backup/cold/20250509/initorcl.ora' FROM SPFILE;

CF+DF+RF파일 + initorcl.ora 백업 세트가 완성되었다.



```