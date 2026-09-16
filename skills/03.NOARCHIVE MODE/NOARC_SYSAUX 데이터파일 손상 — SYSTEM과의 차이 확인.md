```sql
콜드백업
SELECT file#, name, status FROM v$datafile ORDER BY file#;

장애 유발
!rm -f /u02/oradata/orcl/sysaux01.dbf
ALTER SYSTEM FLUSH BUFFER_CACHE;

-- AWR 관련 조회만 실패한다.

SYS@orcl> SELECT COUNT(*) FROM dba_hist_snapshot;
SELECT COUNT(*) FROM dba_hist_snapshot
                     *
ERROR at line 1:
ORA-01116: error in opening database file 3
ORA-01110: data file 3: '/u01/app/oracle/oradata/ORCL/sysaux01.dbf'
ORA-27041: unable to open file

-- 실습 4-5의 SYSTEM 손상에서는 dba_tables 조회부터 실패했다.
-- 증상만으로 어느 파일이 문제인지 좁힐 수 있다.

SYS@orcl> !tail -4 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log
Errors in file /u01/app/oracle/diag/rdbms/orcl/orcl/trace/orcl_m000_11284.trc:
ORA-01110: data file 3: '/u01/app/oracle/oradata/ORCL/sysaux01.dbf'
ORA-01116: error in opening database file 3
ORA-27041: unable to open file

-- m000은 MMON의 슬레이브 프로세스다. AWR 스냅숏 수집이 실패하고 있다.


SYS@orcl> ALTER DATABASE DATAFILE 3 OFFLINE;
ALTER DATABASE DATAFILE 3 OFFLINE
*
ERROR at line 1:
ORA-01145: offline immediate disallowed unless media recovery enabled

-- << 원인 파악 >>
-- SYSTEM과 달리 ORA-01541이 아니라 ORA-01145가 나왔다.
-- 즉 "SYSAUX라서 안 된다"가 아니라 "NOARCHIVELOG라서 OFFLINE이 안 된다"는 뜻이다.

ALTER DATABASE DATAFILE 3 OFFLINE;
*
ERROR at line 1:
ORA-01145: offline immediate disallowed unless media recovery enabled

-- << 원인 파악 >>
-- SYSTEM과 달리 ORA-01541이 아니라 ORA-01145가 나왔다.
-- 즉 "SYSAUX라서 안 된다"가 아니라 "NOARCHIVELOG라서 OFFLINE이 안 된다"는 뜻이다.
-- SYSAUX 자체는 오프라인 대상이 될 수 있으며, OFFLINE DROP은 허용된다.

SYS@orcl> ALTER DATABASE DATAFILE 3 OFFLINE DROP;

손상된 SYSAUX 데이터파일을 오프라인(OFFLINE / OFFLINE DROP)으로 내린 이유는 "DB 전체를 셧다운하지 않고, 손상된 파일만 격리시켜 대고객 서비스를 계속 유지할 수 있는가?"를 확인하고 SYSTEM 테이블스페이스와의 결정적 차이를 검증하기 위해서

SELECT file#, name, status FROM v$datafile WHERE file# = 3;

     FILE# NAME                                          STATUS
---------- --------------------------------------------- -------
         3 /u01/app/oracle/oradata/ORCL/sysaux01.dbf     RECOVER

SHUTDOWN ABORT
!cp -p /콜드백업경로/sysaux01.dbf /u02/oradata/orcl/

STARTUP MOUNT
SET AUTORECOVERY ON
RECOVER DATAFILE 3;

ALTER DATABASE DATAFILE 3 ONLINE;
ALTER DATABASE OPEN;
```