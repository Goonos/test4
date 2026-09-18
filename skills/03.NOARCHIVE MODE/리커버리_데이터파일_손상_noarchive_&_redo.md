```sql
SHUTDOWN IMMEDIATE
!mkdir -p /fra/backup/ch04
!cp -p /u02/oradata/orcl/ *.dbf /fra/backup/ch04
!cp -p /u02/oradata/orcl/ *.ctl /fra/backup/ch04
!cp -p /u02/oradata/orcl/ *.log /fra/backup/ch04
!rm -f /fra/backup/ch04/temp01.dbf

STARTUP
SELECT checkpoint_change# FROM v$database;
CHECKPOINT_CHANGE#
------------------
	   3398263

CREATE TABLE hr.emp_temp(id NUMBER) TABLESPACE users;
INSERT INTO hr.emp_temp VALUES (1);
COMMIT;
SELECT COUNT(*) FROM hr.emp_temp;

SYS@orcl> SELECT group#, sequence#, first_change#, status FROM v$log ORDER BY group#;

    GROUP#  SEQUENCE# FIRST_CHANGE# STATUS
---------- ---------- ------------- ----------------
         1         45       2349904 INACTIVE
         3         46       2350118 CURRENT
         4         44       2349511 INACTIVE

-- 로그 스위치를 거의 하지 않았으므로 백업 SCN(2350118)이 리두 구간 안에 있다.


장애유발
!rm -f /u02/oradata/orcl/users01.dbf

이후 조회안됨
SELECT COUNT(*) FROM hr.emp_temp;

SYS@orcl> SELECT file#, error, change#, time FROM v$recover_file;

     FILE# ERROR                    CHANGE# TIME
---------- -------------------- ----------- -------------------
         7 FILE NOT FOUND                 0

-- 파일이 존재하지 않는다. 복원부터 필요하다.

SYS@orcl> SELECT MIN(first_change#) AS oldest_redo_scn FROM v$log;

OLDEST_REDO_SCN
---------------
        2349511

-- 백업본 SCN(2350118) >= 최소 리두 SCN(2349511)
-- 필요한 리두가 살아 있다. 부분 복원 + RECOVER 경로로 간다.

SYS@orcl> !mkdir -p /fra/before_recover_41
SYS@orcl> 
!cp -p /u02/oradata/orcl/ *.ctl /fra/before_recover_41
!cp -p /u02/oradata/orcl/ *.log /fra/before_recover_41


SHUTDOWN ABORT
-- 손상된 파일만 복원한다. 제어 파일과 리두 로그는 건드리지 않는다.

SYS@orcl> !cp -p /fra/backup/ch04/users01.dbf /u02/oradata/orcl/


SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         7                          2350118

-- ERROR가 비고 CHANGE#만 남았다. 파일은 있으나 백업 시점에서 뒤처져 있다는 뜻이다.

SYS@orcl> SET AUTORECOVERY ON
SYS@orcl> RECOVER DATAFILE 7;
Media recovery complete.

ALTER DATABASE OPEN;

-- 데이터 검증 : 백업 이후 만든 데이터가 살아 있는가

SYS@orcl> SELECT COUNT(*) FROM hr.emp_temp;
```