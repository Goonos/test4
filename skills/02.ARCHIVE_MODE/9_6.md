```sql
**초기 세팅**
ALTER TABLESPACE users BEGIN BACKUP;
!cp -p /fra/oradata/ORCL/users01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE users END BACKUP;
Tablespace altered.

SELECT group#, sequence#, first_change#, status FROM v$log
  ORDER BY sequence#;

    GROUP#  SEQUENCE# FIRST_CHANGE# STATUS
---------- ---------- ------------- ----------
         3         49       2416200 INACTIVE
         4         50       2416640 INACTIVE
         1         51       2417020 CURRENT

INSERT INTO hr.emp94 VALUES (6);
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;
INSERT INTO hr.emp94 VALUES (7);
COMMIT;
System altered.

SELECT COUNT(*) FROM hr.emp94;

  COUNT(*)
----------
         7

SELECT group#, sequence#, first_change#, status FROM v$log
  ORDER BY sequence#;

    GROUP#  SEQUENCE# FIRST_CHANGE# STATUS
---------- ---------- ------------- ----------
         4         50       2416640 INACTIVE
         1         51       2417020 INACTIVE
         3         52       2417480 CURRENT

실습 9-5를 마친 상태에서 7번 데이터파일(users01.dbf)의 현재 경로를 기준으로 핫백업을 수행합니다.
온라인 리두 로그 그룹의 시퀀스와 시작 SCN(FIRST_CHANGE#)을 확인합니다.
새로운 데이터를 입력 및 커밋한 후 아카이브 로그를 생성하고 다시 데이터를 삽입하여 커밋합니다.
최종 테이블 건수를 확인한 뒤 리두 로그 상태를 재조회하여, 현재 복구에 필요한 시퀀스(50~52)가 온라인 리두 로그(v$log)에 아직 덮어써지지 않고 그대로 남아있음을 확인합니다.

**장애 유발**
!rm -f /fra/oradata/ORCL/users01.dbf

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /arch1/1_51_1200530011.dbf /u03/arch2/1_51_1200530011.dbf

!ls /arch1/ | grep '_51_' | wc -l
0
!ls /u03/arch2/ | grep '_51_' | wc -l
0

운영체제 레벨에서 7번 데이터파일(users01.dbf)을 삭제하고 버퍼 캐시를 비워 장애를 발생시킵니다.
동시에 아카이브 로그 정리 작업의 오류를 가정하여, 두 아카이브 대상 경로(/arch1, /u03/arch2)에서 복구에 필수적인 시퀀스 51번 아카이브 로그를 전량 강제 삭제합니다.

**진단**
SELECT COUNT(*) FROM hr.emp94;
ERROR at line 1:
ORA-01116: error in opening database file 7
ORA-01110: data file 7: '/fra/oradata/ORCL/users01.dbf'
ORA-27041: unable to open file

ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

!cp -p /fra/backup/hotbackup/users01.dbf /fra/oradata/ORCL/

SET AUTORECOVERY ON
RECOVER TABLESPACE users;
ORA-00279: change 2417020 generated at 05/11/2025 14:32:08 needed for thread 1
ORA-00289: suggestion : /arch1/1_51_1200530011.dbf
ORA-00280: change 2417020 for thread 1 is in sequence #51

ORA-00308: cannot open archived log '/arch1/1_51_1200530011.dbf'
ORA-27037: unable to obtain file status
Linux-x86_64 Error: 2: No such file or directory

SELECT file#, error, change# FROM v$recover_file;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         7                          2417020

SELECT MIN(first_change#) AS oldest_online FROM v$log;

OLDEST_ONLINE
-------------
      2416640

SELECT l.group#, l.sequence#, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.sequence#;

    GROUP#  SEQUENCE# STATUS     MEMBER
---------- ---------- ---------- --------------------------------------------
         4         50 INACTIVE   /u02/oradata/orcl/redo04.log
         4         50 INACTIVE   /fra/oradata/ORCL/redo04b.log
         1         51 INACTIVE   /u02/oradata/orcl/redo01.log
         1         51 INACTIVE   /fra/oradata/ORCL/redo01b.log
         3         52 CURRENT    /u02/oradata/orcl/redo03.log
         3         52 CURRENT    /fra/oradata/ORCL/redo03b.log

6 rows selected.

테이블 접근 에러(ORA-01116)를 통해 7번 파일의 유실을 확인합니다.
손상된 테이블스페이스를 강제 오프라인 처리하고 백업본을 복원한 후 자동 복구 모드로 RECOVER를 시도하지만, 필수적인 아카이브 파일(시퀀스 51)이 모두 지워져 ORA-00308 에러와 함께 복구가 중단됩니다.
복구 시작을 요구하는 SCN(2417020)과 현재 온라인 리두 로그가 보관 중인 가장 오래된 SCN(2416640)을 비교하여, 요구되는 구간이 아직 온라인 리두에 남아 있음을 계산해 냅니다.
v$log 및 v$logfile 조회를 통해 요구 시퀀스 51과 52가 온라인 리두 멤버(/u02/oradata/orcl/redo01.log, redo03.log 등)에 온전히 존재함을 확인하고 완전 복구가 가능함을 판정합니다.

**복구 절차**
!ls /u02/oradata/orcl/redo01.log
/u02/oradata/orcl/redo01.log

SET AUTORECOVERY OFF
RECOVER TABLESPACE users;
ORA-00279: change 2417020 generated at 05/11/2025 14:32:08 needed for thread 1
ORA-00289: suggestion : /arch1/1_51_1200530011.dbf
ORA-00280: change 2417020 for thread 1 is in sequence #51

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
/u02/oradata/orcl/redo01.log
Log applied.

ORA-00279: change 2417480 generated at 05/11/2025 14:34:20 needed for thread 1
ORA-00280: change 2417480 for thread 1 is in sequence #52

Specify log: {<RET>=suggested | filename | AUTO | CANCEL}
/u02/oradata/orcl/redo03.log
Log applied.
Media recovery complete.

AUTORECOVERY 모드는 아카이브 경로만 탐색하므로 온라인 리두 로그를 직접 대입해 주지 않습니다.
따라서 AUTORECOVERY OFF 상태로 수동 RECOVER를 수행하고, 오라클이 지워진 아카이브 파일(시퀀스 51)을 찾을 때 프롬프트에 직접 해당 시퀀스를 담고 있는 온라인 리두 로그 멤버의 경로(/u02/oradata/orcl/redo01.log)를 입력해 적용시킵니다.
이어서 시퀀스 52를 요구할 때도 CURRENT 그룹의 멤버 경로(/u02/oradata/orcl/redo03.log)를 입력하여 미디어 복구를 완벽하게 성공시킵니다.

**디비 오픈**
ALTER TABLESPACE users ONLINE;

아카이브 없이 온라인 리두 대체만으로 미디어 복구가 정상 완료되었으므로 복구된 테이블스페이스를 ONLINE 상태로 전환합니다.
```