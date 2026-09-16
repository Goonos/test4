```sql
INSERT INTO hr.emp_temp VALUES (2);
COMMIT;
SELECT COUNT(*) FROM hr.emp_temp;
조회 확인

리두 정보 오버라이트
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM SWITCH LOGFILE;

장애 발생
!rm -f /u02/oradata/orcl/users01.dbf

장애 확인
SELECT COUNT(*) FROM hr.emp_temp;

SELECT MIN(first_change#) AS oldest_redo_scn FROM v$log;
OLDEST_REDO_SCN
---------------
	3602230
SCN확인

현재상태 복사
 !cp -p /u02/oradata/orcl/ *.ctl /u02/oradata/orcl/ *.log /fra/before_recover_42
 
-- 먼저 부분 복원을 시도해 실제로 막히는 것을 확인한다.
SHUTDOWN ABORT
 !cp -p /fra/backup/ch04/users01.dbf /u02/oradata/orcl/
 
 STARTUP MOUNT
SYS@orcl> SET AUTORECOVERY OFF -- 아카이브 파일 없어서 오프사캄
SYS@orcl> RECOVER DATAFILE 7;
ORA-00279: change 2350118 generated at 05/09/2025 16:02:11 needed for thread 1
ORA-00289: suggestion : /u01/app/oracle/product/19.3.0/dbhome_1/dbs/arch1_46_1200525254.dbf
ORA-00280: change 2350118 for thread 1 is in sequence #46
-- << 원인 파악 >>
-- 시퀀스 46의 리두를 요구하는데 그 로그는 이미 덮어써졌다.
-- NOARCHIVELOG이므로 아카이브본도 없다.
-- ORA-01547의 "RECOVER succeeded"는 성공이 아니라
-- "적용 가능한 만큼만 적용했다"는 뜻이며, ORA-01194가 미완료를 알린다.


ALTER DATABASE OPEN;

전체 복원으로 전환한다. 데이터 파일·제어 파일·리두 로그를 모두 되돌린다.

SHUTDOWN ABORT
SYS@orcl> !cp -p /fra/backup/ch04/ *.dbf /u02/oradata/orcl/
SYS@orcl> !cp -p /fra/backup/ch04/ *.ctl /u02/oradata/orcl/
SYS@orcl> !cp -p /fra/backup/ch04/ *.log /u02/oradata/orcl/
SYS@orcl> !cp -p /fra/backup/ch04/control01.ctl /u01/app/oracle/fast_recovery_area/ORCL/control02.ctl

STARTUP

성공

```