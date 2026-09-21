```sql
**초기 세팅**
SHUTDOWN IMMEDIATE
!rm -rf /fra/backup/cold/20260907_100053 && mkdir -p /fra/backup/cold/20260907_100053
!cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260907_100053/
!rm -f /fra/backup/cold/20260907_100053/temp01.dbf
STARTUP

SELECT checkpoint_change# FROM v$database;

CHECKPOINT_CHANGE#
------------------
           4403213


CREATE TABLE hr.insa_2025(id NUMBER, order_date DATE) TABLESPACE users;
Table created.

INSERT INTO hr.insa_2025 VALUES (1, SYSDATE);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.insa_2025 VALUES (2, SYSDATE);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.insa_2025 VALUES (3, SYSDATE);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT id, TO_CHAR(order_date, 'HH24:MI:SS') AS t FROM hr.insa_2025 ORDER BY id;

        ID T
---------- --------
         1 09:04:11
         2 09:08:30
         3 09:12:44

SELECT sequence#, first_change#, next_change#,
            TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
  FROM  v$log_history WHERE sequence# BETWEEN 60 AND 63 ORDER BY sequence#;

 SEQUENCE# FIRST_CHANGE# NEXT_CHANGE# FIRST_TIME
---------- ------------- ------------ ----------
        60       2419200      2419840 09:02:11
        61       2419840      2420100 09:08:22
        62       2420100      2420480 09:12:40
        63       2420480      2420900 09:16:05

데이터베이스를 정상 종료하고 전체 데이터파일을 새로 콜드 백업합니다.
백업을 마친 후 기동하여 체크포인트 SCN을 확인합니다.
테스트용 테이블(hr.insa_2025)을 생성하고 데이터를 한 건씩 입력 및 커밋한 후 아카이브를 발생시키는 작업을 3번 반복합니다.
이후 입력된 데이터의 시각과 v$log_history 뷰를 통해 각 아카이브 로그 시퀀스의 첫 SCN(FIRST_CHANGE#) 및 생성 시각을 확인합니다.

**장애 유발**

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/users01.dbf

!dd if=/dev/zero of=/arch/arch_1_18_1243344001.arc bs=1024 count=8 conv=notrunc
8+0 records in
8+0 records out

운영체제 레벨에서 7번 데이터파일(users01.dbf)을 강제로 삭제하여 데이터파일 손상을 유발합니다.
추가로 dd 명령어를 사용하여 62번 시퀀스의 아카이브 로그 파일 헤더 부분을 0으로 덮어써서 복구에 필요한 아카이브 파일을 고의로 손상시킵니다.
버퍼 캐시를 비워 물리적 디스크 접근을 유도하여 데이터파일 유실이 즉각 인지되도록 합니다.

**진단**
SELECT COUNT(*) FROM hr.insa_2025;
ERROR at line 1:
ORA-01116: error in opening database file 7
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-27041: unable to open file

ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

!cp -p /fra/backup/cold/20260910_151606/users01.dbf /u02/oradata/orcl/

SET AUTORECOVERY ON
RECOVER TABLESPACE users;
ORA-00279: change 2419200 generated at 05/12/2025 09:02:11 needed for thread 1
ORA-00289: suggestion : /arch1/arch_1_60_1200533800.arc
ORA-00280: change 2419200 for thread 1 is in sequence #60

Log applied.
Log applied.

ORA-00283: recovery session canceled due to errors
ORA-00368: checksum error in redo log block
ORA-00353: log corruption near block 512 change 2420100 time 05/12/2025 09:12:40
ORA-00334: archived log: '/arch1/arch_1_62_1200533800.arc'

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         7                          2420100

SELECT sequence#, status FROM v$archived_log
  WHERE  sequence# BETWEEN 60 AND 64 ORDER BY sequence#;

 SEQUENCE# S
---------- -
        60 A
        61 A
        62 A
        63 A
        64 A

SELECT MIN(first_change#) AS oldest_online FROM v$log;

OLDEST_ONLINE
-------------
      4405106

SELECT SCN_TO_TIMESTAMP(4403213) AS max_recover_point FROM dual;

MAX_RECOVER_POINT
---------------------------------------------------------
12-MAY-25 09.12.40.000000000 AM

!mkdir -p /fra/backup/cold/20260907_100053/before_recover_101
!cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260907_100053/before_recover_101/

테이블을 조회해 7번 파일이 손상되었음을 확인하고, 해당 테이블스페이스를 강제 오프라인 처리 후 백업본을 복원해 완전 복구를 시도합니다.
하지만 62번 아카이브 파일이 손상되었기 때문에 ORA-00368(체크섬 에러)과 ORA-00353 에러를 뱉으며 시퀀스 61까지만 복구되고 멈춥니다.
온라인 리두의 최소 SCN(2420900)이 복구 시작을 요구하는 SCN(2420100)보다 크기 때문에 온라인 리두로도 대체할 수 없음을 진단합니다.
결국 61번 시퀀스(09:12:40)까지만 데이터를 살릴 수 있는 불완전 복구를 수행하기로 결정하고, 추가적인 복구 실패에 대비해 현재 상태의 모든 데이터파일을 백업해 둡니다.

**복구 절차**
SHUTDOWN ABORT
STARTUP MOUNT

SET AUTORECOVERY OFF
RECOVER DATABASE UNTIL CANCEL;
ORA-00283: recovery session canceled due to errors
ORA-01152: file 1 was not restored from a sufficiently old backup
ORA-01110: data file 1: '/u02/oradata/orcl/system01.dbf'

SELECT file#, checkpoint_change#,
            TO_CHAR(checkpoint_time, 'HH24:MI:SS') AS ckpt_time
  FROM  v$datafile_header ORDER BY file#;

!cp -p /fra/backup/cold/20260910_151606/ *.dbf /u02/oradata/orcl/

SELECT file#, checkpoint_change# FROM v$datafile_header ORDER BY file#;

     FILE# CHECKPOINT_CHANGE#
---------- ------------------
         1            2419200
         3            2419200
         4            2419200
         7            2419200

RECOVER DATABASE UNTIL CANCEL;
ORA-00279: change 2419200 generated at 05/12/2025 09:02:11 needed for thread 1
ORA-00289: suggestion : /arch1/arch_1_60_1200533800.arc
ORA-00280: change 2419200 for thread 1 is in sequence #60

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}

Log applied.

ORA-00279: change 2419840 generated at 05/12/2025 09:08:22 needed for thread 1
ORA-00289: suggestion : /arch1/arch_1_61_1200533800.arc
ORA-00280: change 2419840 for thread 1 is in sequence #61

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}

Log applied.

ORA-00279: change 2420100 generated at 05/12/2025 09:12:40 needed for thread 1
ORA-00289: suggestion : /arch1/arch_1_62_1200533800.arc
ORA-00280: change 2420100 for thread 1 is in sequence #62

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
CANCEL
Media recovery cancelled.

불완전 복구는 과거의 특정 시점으로 데이터베이스 전체를 되돌리는 작업이므로, 7번 파일만 복원한 상태에서 시도하면 ORA-01152 에러가 발생합니다.
따라서 ABORT 후 MOUNT 상태로 기동하여 모든 데이터파일을 과거 시점의 백업본으로 복원하고 전체 파일의 헤더 SCN을 통일시킵니다.
다시 RECOVER DATABASE UNTIL CANCEL 명령을 실행하여, 적용 가능한 61번 시퀀스까지는 엔터를 쳐서(기본 제안 파일) 리두를 적용하고, 손상된 62번 시퀀스를 요구할 때 CANCEL을 입력하여 미디어 복구를 수동으로 중단합니다.

**디비 오픈**
ALTER DATABASE OPEN READ ONLY;

Database altered.

SELECT id, TO_CHAR(order_date, 'HH24:MI:SS') AS t FROM hr.insa_2025 ORDER BY id;

        ID T
---------- --------
         1 09:04:11
         2 09:08:30

SHUTDOWN IMMEDIATE
STARTUP MOUNT
ALTER DATABASE OPEN RESETLOGS;


불완전 복구를 마친 뒤 데이터베이스를 안전하게 읽기 전용(READ ONLY)으로 오픈하여, 3번 데이터가 들어가기 전인 2번 데이터까지만 존재하는지 예상했던 복구 지점이 맞는지 검증합니다.
데이터 검증이 완벽하게 끝나면 정상 종료 후 다시 마운트 상태로 올려 RESETLOGS 옵션을 통해 새로운 인카네이션으로 데이터베이스를 오픈합니다.
```