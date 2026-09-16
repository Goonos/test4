```sql
**초기 세팅**
ALTER SYSTEM SET log_archive_dest_1 = 'LOCATION=/arch1 MANDATORY'
   SCOPE=BOTH;
System altered.

ALTER SYSTEM SET log_archive_dest_2 = 'LOCATION=/u03/arch2 OPTIONAL'
   SCOPE=BOTH;
System altered.

SELECT dest_id, destination, status, binding, error
  FROM  v$archive_dest WHERE destination IS NOT NULL;

   DEST_ID DESTINATION          STATUS    BINDING    ERROR
---------- -------------------- --------- ---------- ----------
         1 /arch1               VALID     MANDATORY
         2 /u03/arch2           VALID     OPTIONAL

SHOW PARAMETER log_archive_min_succeed_dest

NAME                            TYPE      VALUE
------------------------------- --------- ------
log_archive_min_succeed_dest    integer   1

ALTER TABLESPACE users BEGIN BACKUP;
!cp -p /u02/oradata/orcl/users01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE users END BACKUP;
Tablespace altered.

INSERT INTO hr.emp94 VALUES (3);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
INSERT INTO hr.emp94 VALUES (4);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
INSERT INTO hr.emp94 VALUES (5);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

SELECT dest_id, sequence#, name FROM v$archived_log
  WHERE  sequence# >= 46 ORDER BY sequence#, dest_id;

   DEST_ID  SEQUENCE# NAME
---------- ---------- ----------------------------------------
         1         46 /arch1/1_46_1200530011.dbf
         2         46 /u03/arch2/1_46_1200530011.dbf
         1         47 /arch1/1_47_1200530011.dbf
         2         47 /u03/arch2/1_47_1200530011.dbf
         1         48 /arch1/1_48_1200530011.dbf
         2         48 /u03/arch2/1_48_1200530011.dbf

6 rows selected.

실습 9-4를 마친 상태에서 아카이브 다중 대상 구성을 위해 log_archive_dest_1을 /arch1(MANDATORY)로, log_archive_dest_2를 /u03/arch2(OPTIONAL)로 지정합니다.
v$archive_dest 뷰와 파라미터를 조회하여 두 개의 아카이브 경로가 정상 설정되었는지 점검합니다.
데이터파일 핫백업을 수행하고 세 번의 데이터 삽입과 아카이브 생성을 반복하여 동일한 시퀀스 번호의 아카이브 로그 파일이 두 목적지(/arch1, /u03/arch2)에 각각 복제되어 생성되었음을 v$archived_log를 통해 확인합니다.

**장애 유발**
!rm -f /u02/oradata/orcl/users01.dbf

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /arch1/1_47_1200530011.dbf

!ls /arch1/ | tail -3
1_46_1200530011.dbf
1_48_1200530011.dbf

운영체제 명령어(rm)를 사용하여 users01.dbf 데이터파일을 삭제하고 버퍼 캐시를 비워 물리적 접근 에러를 유발합니다.
아카이브 파일 정리 스크립트 오류를 가정하여, 주 아카이브 경로(1번 대상, /arch1)에서 복구에 필수적인 시퀀스 47번 아카이브 로그 파일만 고의로 삭제해 결손 상황을 만듭니다.

**진단**
SELECT COUNT(*) FROM hr.emp94;
ERROR at line 1:
ORA-01116: error in opening database file 7
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-27041: unable to open file

SELECT file#, status FROM v$datafile WHERE file# = 7;

     FILE# STATUS
---------- -------
         7 RECOVER

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         7 FILE NOT FOUND                 0

SELECT dest_id, MIN(sequence#) AS min_seq, MAX(sequence#) AS max_seq,
           COUNT(*) AS cnt
  FROM  v$archived_log WHERE status = 'A' AND sequence# >= 46
  GROUP  BY dest_id ORDER BY dest_id;

   DEST_ID    MIN_SEQ    MAX_SEQ        CNT
---------- ---------- ---------- ----------
         1         46         48          3
         2         46         48          3

!ls /arch1/ *.dbf | wc -l
2

!ls /u03/arch2/ *.dbf | wc -l
3

테이블을 조회하여 ORA-01116 에러를 통해 파일 접근 실패를 확인하고, 7번 데이터파일의 상태가 RECOVER로 자동 변경되었음을 확인합니다.
v$archived_log 뷰에는 1번, 2번 대상 모두 아카이브 로그 3개(시퀀스 46~48)가 존재한다고 기록되어 있지만(OS에서 강제 삭제했기 때문), 실제 OS 레벨에서는 1번 대상(/arch1)에 2개, 보조 대상(/u03/arch2)에 3개가 존재함을 확인합니다.
이를 통해 보조 아카이브 경로에 있는 파일을 활용하여 완전 복구를 수행하기로 판정합니다.

**복구 절차**
ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

!cp -p /fra/backup/hotbackup/users01.dbf /u02/oradata/orcl/

SET AUTORECOVERY ON
RECOVER TABLESPACE users;
ORA-00279: change 2415100 generated at 05/11/2025 14:08:33 needed for thread 1
ORA-00289: suggestion : /arch1/1_46_1200530011.dbf
ORA-00280: change 2415100 for thread 1 is in sequence #46

Log applied.

ORA-00308: cannot open archived log '/arch1/1_47_1200530011.dbf'
ORA-27037: unable to obtain file status
Linux-x86_64 Error: 2: No such file or directory

!ls -l /u03/arch2/1_47_1200530011.dbf
-rw-r-----. 1 oracle oinstall 12583424 May 11 14:10 /u03/arch2/1_47_1200530011.dbf

SET AUTORECOVERY OFF
RECOVER TABLESPACE users;
ORA-00279: change 2415440 generated at 05/11/2025 14:09:12 needed for thread 1
ORA-00289: suggestion : /arch1/1_47_1200530011.dbf
ORA-00280: change 2415440 for thread 1 is in sequence #47

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
/u03/arch2/1_47_1200530011.dbf
Log applied.

ORA-00279: change 2415820 generated at 05/11/2025 14:09:55 needed for thread 1
ORA-00280: change 2415820 for thread 1 is in sequence #48

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
AUTO
Media recovery complete.

손상된 테이블스페이스를 강제 오프라인 처리하고 백업본을 복원한 후 자동 복구(AUTORECOVERY ON) 모드로 RECOVER를 시도합니다.
46번 파일은 주 경로(/arch1)에 있어 정상 적용되지만, 47번 파일은 지워졌기 때문에 오라클이 기본 경로에서만 찾으려다 파일 오픈 실패(ORA-00308, ORA-27037) 에러를 내고 복구가 중단됩니다.
보조 경로(/u03/arch2)에 47번 파일이 존재하는 것을 확인한 후, AUTORECOVERY OFF 상태로 수동 RECOVER 명령을 재수행하여 제안된 주 경로 대신 보조 경로의 파일 위치(/u03/arch2/1_47_1200530011.dbf)를 직접 타이핑해 결손 구간을 통과합니다.
결손 시퀀스를 넘긴 이후에는 다시 AUTO를 입력해 남은 복구를 자동 완료합니다.

**디비 오픈**
ALTER TABLESPACE users ONLINE;
미디어 복구가 성공적으로 완료되었으므로 테이블스페이스를 다시 ONLINE 상태로 전환합니다.
```