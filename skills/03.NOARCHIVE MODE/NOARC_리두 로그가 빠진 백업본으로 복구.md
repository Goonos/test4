```sql
Cold Backup을 받을 때 리두 로그를 빠뜨렸다.
백업시 리두 제외

장애 유발 : 백업 이후 변경과 데이터 파일 유실
CREATE TABLE hr.emp57(id NUMBER) TABLESPACE users;

INSERT INTO hr.emp57 VALUES (1);

COMMIT;

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

!rm -f /u02/oradata/orcl/system01.dbf
SHUTDOWN ABORT

증상확인
STARTUP
ORA-01157: cannot identify/lock data file 1 - see DBWR trace file
ORA-01110: data file 1: '/u01/app/oracle/oradata/ORCL/system01.dbf'

전체 복원하려는데 리두가 없다.
일단 모든 파일 다 제자리 가져다 놓고 DB올린다.

STARTUP
ORACLE instance started.
Database mounted.
ORA-00314: log 1 of thread 1, expected sequence# 63 doesnt match 68
ORA-00312: online log 1 thread 1: '/u01/app/oracle/oradata/ORCL/redo01.log '
 << 원인 파악 >>
 복원한 제어 파일은 백업 시점 기준으로 시퀀스 63을 기대한다.
 그러나 디스크의 리두 로그는 그 뒤로 계속 쓰여 시퀀스 68이 되어 있다.
 백업본에 리두 로그가 없어 함께 되돌리지 못한 결과다.
 제어 파일과 리두 로그는 짝을 이루어야 하며 한쪽만 되돌리면 어긋난다.

내용이 맞지 않는 로그이므로 비워서 다시 만든다.

ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 1;
ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 2;
ALTER DATABASE CLEAR UNARCHIVED LOGFILE GROUP 3;

그냥 올리면 리커버 하라고 한다. 리커버 할 수 없으니
SYS@orcl> ALTER DATABASE OPEN;
ALTER DATABASE OPEN
ERROR at line 1:
ORA-01113: file 1 needs media recovery
ORA-01110: data file 1: '/u01/app/oracle/oradata/ORCL/system01.dbf'

RECOVER DATABASE UNTIL CANCEL;
리커버 없이 올린다.

로그 리셋해서 마지막으로 서버를 다시 올린다.
ALTER DATABASE OPEN RESETLOGS;

SELECT incarnation#, resetlogs_change#, status FROM v$database_incarnation;

INCARNATION# RESETLOGS_CHANGE# STATUS
------------ ----------------- -------
	   1		     1 PARENT
	   2	       1920977 PARENT
	   3	       3966836 CURRENT


SELECT group#, sequence#, status FROM v$log ORDER BY group#;

    GROUP#  SEQUENCE# STATUS
---------- ---------- ----------------
         1          1 CURRENT
         2          0 UNUSED
         3          0 UNUSED
-- 시퀀스가 1부터 다시 시작한다.
```