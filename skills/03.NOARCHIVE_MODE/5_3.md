```sql
coldbackup 실행

SYS@orcl> SELECT MAX(salary) AS max_sal FROM hr.employees;

   MAX_SAL
----------
     24000
 복구 후 이 값으로 돌아와야 한다(커밋하지 않은 변경은 롤백되므로).

실습시작
UPDATE employees SET salary = salary * 1.5;
SELECT MAX(salary) FROM employees;

MAX(SALARY)
-----------
      36000
커밋하지 않는다. 이 세션을 그대로 둔다.

장애 유발
!rm -f /u02/oradata/undotbs01.dbf

SHUTDOWN ABORT
STARTUP

alert log 에러 내용
SYS@orcl> !tail -8 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log
Beginning crash recovery of 1 threads
Started redo scan
Completed redo scan
  read 284 KB redo, 64 data blocks need recovery
Errors in file .../orcl_ora_14022.trc:
ORA-01157: cannot identify/lock data file 4
ORA-01110: data file 4: '/u01/app/oracle/oradata/ORCL/undotbs01.dbf'
ORA-1157 signalled during: ALTER DATABASE OPEN...

 인스턴스 복구의 롤포워드까지는 시작했으나 UNDO 파일이 없어 중단되었다.

백업본 리스토어
cp 백업경로~/ dbf경로

SET AUTORECOVERY ON
RECOVER DATABASE;
ALTER DATABASE OPEN;
 
```