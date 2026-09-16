```sql
바이너리파일로 복구
ALTER DATABASE BACKUP CONTROLFILE TO
'/fra/backup/cold/control_20260904.bkp';

CREATE TABLE hr.emp61(id NUMBER) TABLESPACE users;
SYS@orcl> INSERT INTO hr.emp61 VALUES (1);
SYS@orcl> INSERT INTO hr.emp61 VALUES (2);
SYS@orcl> COMMIT;
백업 이후 커밋한 데이터다. 완전 복구되면 살아 있어야 한다.

장애유발
!rm -f /u02/oradata/orcl/.ctl

증상확인
STARTUP
ORACLE instance started.

Total System Global Area 1140849904 bytes
Fixed Size                  8895728 bytes
Variable Size             754974720 bytes
Database Buffers          369098752 bytes
Redo Buffers                7880704 bytes
ORA-00205: error in identifying control file, check alert log for more info


복구
!cp -p /fra/backup/cold/control_20260904.bkp /u02/oradata/orcl/control01.ctl
바이너리 파일을 컨트롤로 복사

같은에러 발생 다른 경로에 다 붙혀준다

startup mount
SELECT l.group#, l.sequence#, l.status, f.member
FROM   v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.sequence#;

    GROUP#  SEQUENCE# STATUS     MEMBER
---------- ---------- ---------- --------------------------------------------
         3         71 INACTIVE   /u01/app/oracle/oradata/ORCL/redo03.log
         3         71 INACTIVE   /u02/oradata/ORCL/redo03b.log
         4         72 INACTIVE   /u01/app/oracle/oradata/ORCL/redo04.log
         4         72 INACTIVE   /u02/oradata/ORCL/redo04b.log
         1         73 CURRENT    /u01/app/oracle/oradata/ORCL/redo01.log
         1         73 CURRENT    /u02/oradata/ORCL/redo01b.log
리두로그 정보 확인


RECOVER DATABASE USING BACKUP CONTROLFILE;
Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
복구실행 후
ALTER DATABASE OPEN RESETLOGS;

정상 오픈
```