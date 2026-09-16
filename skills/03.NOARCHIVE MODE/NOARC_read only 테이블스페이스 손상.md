```sql

CREATE TABLESPACE hist
DATAFILE '/u01/app/oracle/oradata/ORCL/hist01.dbf' SIZE 20M;

CREATE TABLE hr.emp_hist TABLESPACE hist
AS SELECT * FROM hr.employees;

SELECT COUNT(*) FROM hr.emp_hist;

  COUNT(*)
----------
       107

ALTER TABLESPACE hist READ ONLY;
read only 로 변경하는순간 해당 테이블 스페이스의 SCN은 고정된다.

백업
!cp -p /u01/app/oracle/oradata/ORCL/hist01.dbf /home/oracle/backup/ch05/

리두 소진과 장애 유발
UPDATE hr.employees SET salary = salary + 1;
COMMIT;

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

파일 삭제
!rm -f /u01/app/oracle/oradata/ORCL/hist01.dbf
SELECT COUNT(*) FROM hr.emp_hist;
조회 불가

SELECT file#, checkpoint_change#, enabled FROM v$datafile WHERE file# = 10;

     FILE# CHECKPOINT_CHANGE# ENABLED
---------- ------------------ ----------
        10            2365240 READ ONLY
컨트롤파일이 기억하는 해당 데이터파일의 SCN이 백업본과 동일하다
read only이기 때문이다.

해결
!cp -p /home/oracle/backup/ch05/hist01.dbf /u01/app/oracle/oradata/ORCL/
SHUTDOWN ABORT
STARTUP
정상 동작한다.
```