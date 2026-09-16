```sql
트레이스 파일 백업
ALTER DATABASE BACKUP CONTROLFILE TO TRACE
AS '/fra/backup/cold/cf_20260904.sql'; 

!grep -n 'RESETLOGS' /fra/backup/cold/cf_20260904.sql

53:CREATE CONTROLFILE REUSE DATABASE "ORCL" NORESETLOGS  NOARCHIVELOG
119:CREATE CONTROLFILE REUSE DATABASE "ORCL" RESETLOGS  NOARCHIVELOG

!sed -n '53,119p' /fra/backup/cold/cf_20260904.sql
!sed -n '119,160p' /fra/backup/cold/cf_20260904.sql

구조 변경후 장애유발
ALTER TABLESPACE users ADD DATAFILE
'/u02/oradata/orcl/users02.dbf' SIZE 50M;

SYS@orcl> SELECT file#, name FROM v$datafile ORDER BY file#;

     FILE# NAME
---------- ------------------------------------------------
	 1 /u02/oradata/orcl/system01.dbf
	 2 /u02/oradata/orcl/users02.dbf
	 3 /u02/oradata/orcl/sysaux01.dbf
	 4 /u02/oradata/orcl/undotbs01.dbf
	 5 /u02/oradata/orcl/tbs01.dbf
	 7 /u02/oradata/orcl/users01.dbf
	 8 /u02/oradata/orcl/ORCL/datafile/o1_mf_users_o7c7
	   2bh3_.dbf

!rm -f /u02/oradata/orcl/.ctl

증상 관찰
STARTUP
ORA-00205: error in identifying control file, check alert log for more info

복구 진행
startup nomount

CREATE CONTROLFILE REUSE DATABASE "ORCL" NORESETLOGS  NOARCHIVELOG
    MAXLOGFILES 16
    MAXLOGMEMBERS 3
    MAXDATAFILES 100
    MAXINSTANCES 8
    MAXLOGHISTORY 292
LOGFILE
  GROUP 1 (
    '/u02/oradata/orcl/redo01.log',
    '/fra/oradata/ORCL/redo01b.log'
  ) SIZE 50M BLOCKSIZE 512,
  GROUP 2 (
    '/u02/oradata/orcl/redo02.log',
    '/fra/oradata/ORCL/redo02b.log'
  ) SIZE 50M BLOCKSIZE 512,
  GROUP 3 (
    '/u02/oradata/orcl/redo03.log',
    '/fra/oradata/ORCL/redo03b.log'
  ) SIZE 50M BLOCKSIZE 512
-- STANDBY LOGFILE
DATAFILE
  '/u02/oradata/orcl/system01.dbf',
  '/u02/oradata/orcl/sysaux01.dbf',
  '/u02/oradata/orcl/undotbs01.dbf',
  '/u02/oradata/orcl/tbs01.dbf',
  '/u02/oradata/orcl/users01.dbf',
  '/u02/oradata/orcl/ORCL/datafile/o1_mf_users_o7c72bh3_.dbf',
  '/u02/oradata/orcl/users02.dbf'
CHARACTER SET AL32UTF8

ALTER DATABASE OPEN;

문제 없이 열렸다.

최초에 새로 생성한 테이블스페이스의 데이터파일을 추가하지 않고 생성할 경우
SELECT COUNT(*) FROM hr.emp62;
SELECT COUNT(*) FROM hr.emp62
                     *
ERROR at line 1:
ORA-00376: file 8 cannot be read at this time
ORA-01111: name for data file 8 is unknown - rename to correct file
ORA-01110: data file 8: '/u01/app/oracle/product/19.3.0/dbhome_1/dbs/UNNAMED00008'

 << 원인 파악 >>
 DATAFILE 절에 users02.dbf 를 넣지 않았다.
 컨트롤파일에는 그 파일이 등록되지 않았고 Oracle은 UNNAMED00008 이라는
 임시 이름으로 자리만 잡아 두었다.

SELECT file#, name, status FROM v$datafile WHERE file# = 8;

     FILE# NAME                                                        STATUS
---------- ----------------------------------------------------------- -------
         8 /u01/app/oracle/product/19.3.0/dbhome_1/dbs/UNNAMED00008    RECOVER

RENAME FILE 로 실제 경로를 지정한다.

SYS@orcl> SHUTDOWN IMMEDIATE
SYS@orcl> STARTUP MOUNT

SYS@orcl> ALTER DATABASE RENAME FILE
  2    '/u01/app/oracle/product/19.3.0/dbhome_1/dbs/UNNAMED00008'
  3  TO '/u01/app/oracle/oradata/ORCL/users02.dbf';

ALTER DATABASE OPEN;

이후 정상확인
```