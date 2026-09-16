```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48
COL tablespace_name FOR a16

SELECT tablespace_name, status FROM dba_tablespaces
  WHERE  tablespace_name = 'HIST';

TABLESPACE_NAME  STATUS
---------------- ---------
HIST             ONLINE

INSERT INTO hr.emp_hist SELECT * FROM hr.employees;
COMMIT;

SELECT COUNT(*) FROM hr.emp_hist;

  COUNT(*)
----------
       214

ALTER TABLESPACE hist BEGIN BACKUP;
!cp -p /u02/oradata/orcl/hist01.dbf \
                 /fra/backup/hotbackup/hist01_before_ro.dbf
ALTER TABLESPACE hist END BACKUP;
Tablespace altered.

SELECT file#, checkpoint_change#, enabled FROM v$datafile WHERE file# = 10;

     FILE# CHECKPOINT_CHANGE# ENABLED
---------- ------------------ ----------
        10            2409620 READ WRITE

INSERT INTO hr.emp_hist VALUES
    (999, 'LAST', 'ROW', 'last.row', NULL, SYSDATE, 'AD_VP', 1000, NULL, NULL, 90);
COMMIT;

ALTER TABLESPACE hist READ ONLY;
Tablespace altered.

SELECT file#, checkpoint_change#, enabled FROM v$datafile WHERE file# = 10;

     FILE# CHECKPOINT_CHANGE# ENABLED
---------- ------------------ ----------
        10            2409880 READ ONLY

ALTER TABLESPACE hist BEGIN BACKUP;
*
ERROR at line 1:
ORA-01642: begin backup not needed for read only tablespace 'HIST'

!cp -p /u02/oradata/orcl/hist01.dbf \
                 /fra/backup/hotbackup/hist01_after_ro.dbf

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

HIST 테이블스페이스의 현재 상태를 확인하고, 테이블에 데이터를 입력한 후 읽기 전용 상태로 전환하기 전의 핫백업(hist01_before_ro.dbf)을 수행합니다.
추가 데이터를 하나 더 입력한 후 테이블스페이스를 READ ONLY로 전환하고, 전환 시 발생한 체크포인트로 인해 파일의 헤더 SCN이 고정되었음을 확인합니다.
READ ONLY 상태에서는 BEGIN BACKUP 명령이 불필요(ORA-01642 에러)하므로 단순히 OS 복사 명령으로 전환 이후의 백업(hist01_after_ro.dbf)을 수행합니다.
마지막으로 강제 로그 스위치와 아카이브를 발생시킵니다.

**장애 유발**
ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/hist01.dbf

운영체제 레벨에서 읽기 전용 테이블스페이스의 10번 데이터파일(hist01.dbf)을 강제로 삭제합니다.
버퍼 캐시를 비워 물리적 읽기를 유발시켜 데이터파일의 유실을 즉시 인지하도록 만듭니다.

**진단**
SELECT COUNT(*) FROM hr.emp_hist;
ERROR at line 1:
ORA-01116: error in opening database file 10
ORA-01110: data file 10: '/u02/oradata/orcl/hist01.dbf'
ORA-27041: unable to open file

SELECT file#, name, status, enabled FROM v$datafile WHERE file# = 10;

     FILE# NAME                                             STATUS  ENABLED
---------- ------------------------------------------ ------- ----------
        10 /u02/oradata/orcl/hist01.dbf               RECOVER READ ONLY

SELECT file#, error, change# FROM v$recover_file WHERE file# = 10;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
        10 FILE NOT FOUND                 0

!ls -l /fra/backup/hotbackup/hist01*
-rw-r-----. 1 oracle oinstall 20979712 May 11 11:52 hist01_after_ro.dbf
-rw-r-----. 1 oracle oinstall 20979712 May 11 11:50 hist01_before_ro.dbf

테이블 조회를 시도하면 데이터파일 접근 에러(ORA-01116)가 발생하고, 해당 파일의 상태가 자동으로 RECOVER로 변경되었음을 확인합니다.
백업 디렉토리를 조회하여 READ ONLY 전환 이전 백업본과 이후 백업본 두 가지가 모두 안전하게 존재함을 확인합니다.
이 두 가지 백업본을 통해, 전환 이후 백업본은 복원만으로 복구가 완료되고 이전 백업본은 리두 로그 적용이 필요한 차이점을 확인할 계획을 수립합니다.

**복구 절차**
ALTER TABLESPACE hist OFFLINE IMMEDIATE;
Tablespace altered.

!cp -p /fra/backup/hotbackup/hist01_before_ro.dbf \
                 /u02/oradata/orcl/hist01.dbf

ALTER TABLESPACE hist ONLINE;
*
ERROR at line 1:
ORA-01113: file 10 needs media recovery
ORA-01110: data file 10: '/u02/oradata/orcl/hist01.dbf'

SELECT file#, error, change# FROM v$recover_file WHERE file# = 10;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
        10                          2409620

SET AUTORECOVERY ON
RECOVER TABLESPACE hist;
Media recovery complete.

ALTER TABLESPACE hist ONLINE;

Tablespace altered.

테이블스페이스를 강제 오프라인 시킨 후 첫 번째 테스트로 전환 이전 백업본을 원래 경로로 복원합니다.
ONLINE을 시도하면 컨트롤파일이 기대하는 SCN보다 파일 헤더의 SCN이 작아 미디어 복구가 필요하다는 ORA-01113 에러가 발생합니다.
RECOVER 명령을 통해 누락된 SCN 구간의 아카이브 로그를 적용하여 복구를 마치고 온라인 시킵니다.

**디비 오픈**
ALTER TABLESPACE hist OFFLINE IMMEDIATE;
!rm -f /u02/oradata/orcl/hist01.dbf
!cp -p /fra/backup/hotbackup/hist01_after_ro.dbf \
                 /u02/oradata/orcl/hist01.dbf

SELECT file#, error, change# FROM v$recover_file WHERE file# = 10;

no rows selected

ALTER TABLESPACE hist ONLINE;

Tablespace altered.

두 번째 테스트로, 다시 데이터파일을 삭제하고 이번에는 전환 이후 백업본으로 복원합니다.
이 백업본은 파일의 헤더 SCN이 이미 고정된 상태(맞춰진 상태)이므로 v$recover_file에서 복구 대상이 아님이 확인됩니다.
추가적인 RECOVER 명령 없이 단순 복사만으로 즉시 ONLINE으로 복구됩니다.
```