```sql

INSERT INTO hr.emp3 VALUES (200);
INSERT INTO hr.emp3 VALUES (300);
COMMIT;

SELECT COUNT(*) FROM hr.emp3;
  COUNT(*)
----------
         3

장애 유발 : 리두 소진 후 SYSTEM 파일 삭제

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

!rm -f /u02/oradata/orcl/system01.dbf
ALTER SYSTEM FLUSH SHARED_POOL;

!cp -p /home/oracle/backup/ch04/.dbf & .log & .ctl
/u02/oradata/orcl/
/u01/app/oracle/fast_recovery_area/ORCL/
/u02/oradata/orcl/ORCL/datafile/

파일 맞춰서 넣으면 백업 완료
```