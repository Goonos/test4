```sql
SELECT file#, checkpoint_change#, status FROM v$datafile ORDER BY file#;
TABLESPACE_NAME    FILE_ID FILE_NAME
--------------- ---------- --------------------------------------------------
SYSTEM                   1 /u01/app/oracle/oradata/ORCL/system01.dbf
SYSAUX                   3 /u01/app/oracle/oradata/ORCL/sysaux01.dbf
UNDOTBS1                 4 /u01/app/oracle/oradata/ORCL/undotbs01.dbf
USERS                    7 /u01/app/oracle/oradata/ORCL/users01.dbf

SELECT checkpoint_change# FROM v$database;


CHECKPOINT_CHANGE#
------------------
	   3385602

--테이블 스페이스 확인
SELECT tablespace_name, contents, status FROM dba_tablespaces ORDER BY tablespace_name;

TABLESPACE_NAME 	       CONTENTS 	     STATUS
------------------------------ --------------------- ---------
SYSAUX			       PERMANENT	     ONLINE
SYSTEM			       PERMANENT	     ONLINE
TEMP			       TEMPORARY	     ONLINE
UNDOTBS1		       UNDO		     ONLINE
USERS			       PERMANENT	     ONLINE


ALTER TABLESPACE users BEGIN BACKUP;

--백업 정보 확인
SELECT file#, status, change#, time FROM v$backup WHERE file# in (7,8);

     FILE# STATUS		 CHANGE# TIME
---------- ------------------ ---------- ------------------
		 7 ACTIVE		 3387406 02-SEP-26
		 8 ACTIVE		 3387406 02-SEP-26
		 

--헤더 파일 정보 확인
SELECT file#, checkpoint_change# FROM v$datafile_header WHERE file# = 7;

     FILE# CHECKPOINT_CHANGE#
---------- ------------------
	 7	      3387406
	 
SELECT tablespace_name, file_id, file_name FROM dba_data_files ORDER BY file_id;

TABLESPACE_NAME 		  FILE_ID FILE_NAME
------------------------------ ---------- --------------------------------------------------
SYSTEM					1 /u02/oradata/orcl/system01.dbf
SYSAUX					3 /u02/oradata/orcl/sysaux01.dbf
UNDOTBS1				4 /u02/oradata/orcl/undotbs01.dbf
USERS					7 /u02/oradata/orcl/users01.dbf
USERS					8 /u02/oradata/orcl/ORCL/datafile/o1_mf_users_o7c72b
					  h3_.dbf



백업장소에가서
pwd
/hotbkp/20260902/
cp /u02/oradata/orcl/users01.dbf 20260902/
cp /u02/oradata/orcl/ORCL/datafile/o1_mf_users_o7c72bh3_.dbf 20260902/

ALTER TABLESPACE users END BACKUP;

같은 방식으로 모든 테이블 스페이스 백업

SYS@orcl> SELECT file#, status FROM v$backup ORDER BY file#;

     FILE# STATUS
---------- ------------------
         1 NOT ACTIVE
         3 NOT ACTIVE
         4 NOT ACTIVE
         7 NOT ACTIVE

-- 모든 파일의 백업 모드가 해제되었다.

-- 백업 구간의 리두를 아카이브로 확정한다.

SYS@orcl> ALTER SYSTEM ARCHIVE LOG CURRENT;
현재 쓰기 작업 중인 온라인 리두 로그(Online Redo Log)를 즉시 다른 그룹으로 넘기고(로그 스위치), 방금 전까지 기록하던 내용을 아카이브 로그 파일로 완전히 디스크에 저장할 때까지 기다리는 명령어

ALTER DATABASE BACKUP CONTROLFILE TO '/home/oracle/hotbkp/20260902/control.ctl' REUSE;
컨트롤 파일 생성완료

핫백업으로 T/S 단위 백업 및 컨트롤 파일 백업완료
```