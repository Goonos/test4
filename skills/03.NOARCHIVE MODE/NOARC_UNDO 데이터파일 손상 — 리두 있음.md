```sql
SELECT file#, name, status FROM v$datafile WHERE file# = 4;

     FILE# NAME                                          STATUS
---------- --------------------------------------------- -------
         4 /u01/app/oracle/oradata/ORCL/undotbs01.dbf    ONLINE


SELECT segment_name, tablespace_name, status
FROM   dba_rollback_segs WHERE tablespace_name = 'UNDOTBS1' FETCH FIRST 3 ROWS ONLY;
SEGMENT_NAME		       TABLESPACE_NAME		      STATUS
------------------------------ ------------------------------ ----------------
_SYSSMU1_1261223759$	       UNDOTBS1 		   
   ONLINE
_SYSSMU2_27624015$	       UNDOTBS1 		      ONLINE
_SYSSMU3_2421748942$	       UNDOTBS1 		      ONLINE

UPDATE hr.employees SET salary = salary + 100 WHERE department_id = 50;
SELECT MAX(salary) AS max_sal FROM hr.employees WHERE department_id = 50;

장애 유발
!rm -f /u02/oradata/orcl/undotbs01.dbf
ALTER SYSTEM FLUSH BUFFER_CACHE;

언두는 셀렉트와 관련이 없지만 업데이트엔 문제가 생긴다.
SYS@orcl> SELECT COUNT(*) FROM hr.employees;
  COUNT(*)
----------
       107

-- 변경은 실패한다. 언두 블록을 새로 할당해야 하기 때문이다.

SYS@orcl> UPDATE hr.employees SET salary = salary + 1 WHERE ROWNUM <= 10;
       *
ERROR at line 1:

ALTER DATABASE DATAFILE 4 OFFLINE DROP;
SYS@orcl> SELECT file#, name, status FROM v$datafile WHERE file# = 4;
SYS@orcl> SHUTDOWN IMMEDIATE
SYS@orcl> STARTUP
언두데이터파일 없어서 안된다.

리스토어 실행
SHUTDOWN ABORT
!cp /fra/backup/cold/20260903_152455/undotbs01.dbf /u02/oradata/orcl/
STARTUP MOUNT
ALTER DATABASE DATAFILE 4 ONLINE;
SET AUTORECOVERY ON
RECOVER DATABASE;

이후 정상확인
SELECT * FROM v$recover_file;
SYS@orcl> SELECT file#, name, status FROM v$datafile WHERE file# = 4;

     FILE# NAME                                          STATUS
---------- --------------------------------------------- -------
         4 /u01/app/oracle/oradata/ORCL/undotbs01.dbf    ONLINE

SYS@orcl> SELECT MAX(salary) AS max_sal FROM hr.employees WHERE department_id = 50;
-- 백업 이후 커밋한 데이터가 살아 있다. 완전 복구가 성공했다.

```