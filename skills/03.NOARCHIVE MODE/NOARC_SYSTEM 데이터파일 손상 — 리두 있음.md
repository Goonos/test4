```sql
SELECT file#, name, status FROM v$datafile ORDER BY file#;

     FILE# NAME                                          STATUS
---------- --------------------------------------------- -------
         1 /u02/oradata/orcl/system01.dbf     SYSTEM
         3 /u02/oradata/orcl/sysaux01.dbf     ONLINE
         4 /u02/oradata/orcl/undotbs01.dbf    ONLINE
         7 /u02/oradata/orcl/users01.dbf      ONLINE
         8 /u02/oradata/orcl/tbs01.dbf        ONLINE

-- file# 1의 STATUS가 SYSTEM이다. 다른 파일과 지위가 다르다.

SYS@orcl> CREATE TABLE hr.emp3(id NUMBER) TABLESPACE users;
Table created.

SYS@orcl> INSERT INTO hr.emp3 VALUES (100);
1 row created.

SYS@orcl> COMMIT;
Commit complete.

-- 백업 이후 만든 객체다. 완전 복구되면 살아 있어야 한다.

장애 발생
SYS@orcl> !rm -f /u02/oradata/orcl/system01.dbf
SYS@orcl> ALTER SYSTEM FLUSH SHARED_POOL;


-- 일반 테이블스페이스처럼 파일만 떼어 내고 서비스를 유지하려 해 본다.
SYS@orcl> ALTER DATABASE DATAFILE 1 OFFLINE DROP;
ORA-01541: system tablespace cannot be brought offline; shut down if necessary

SHUTDOWN ABORT
!cp -p /fra/backu/ch04/system01.dbf /u02/oradata/orcl/
 
STARTUP MOUNT
SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;
     FILE# CHECKPOINT_CHANGE# FUZ
---------- ------------------ ---
         1            2356402 NO
         3            2356810 YES
         4            2356810 YES
         7            2356810 YES
         8            2356810 YES

**중요**
왜 시스템 파일이 아닌 나머지 파일이 YES(일관성 깨짐)이 뜨냐면
abort 해서 내렸기때문에 얘네들을 일관성을 보장해주지 않고
시스템 파일은 restore 해서 과거 시점이지만 정상적으로 내렸기때문에 일관성을 유지시켜준다.

오라클에서 FUZZY(Fuzziness)는 데이터파일의 일관성(Consistency) 여부를 나타내는 플래그
해당 데이터파일이 헤더에 기록된 체크포인트 SCN(CHECKPOINT_CHANGE#) 시점과 정확히 일치하는지, 아니면 추가적인 복구(리두 로그 적용)가 필요한 상태인지를 구분

FUZZY = YES (비일관 상태 / Inconsistent)
데이터파일 내부에 체크포인트 SCN 이후의 변경 내역이 이미 디스크에 쓰여 있거나, 아직 커밋되지 않은 활성 트랜잭션이 포함되어 있음을 의미합니다.

FUZZY = NO (완전한 일관 상태 / Consistent)
데이터파일의 모든 블록이 헤더의 CHECKPOINT_CHANGE# 시점과 완벽히 일치하며, 추가적인 리두 로그 적용 없이도 그대로 읽을 수 있는 상태입니다.


SET AUTORECOVERY ON
RECOVER DATABASE;
온라인 리두를 이용해서 리커버 완료
```