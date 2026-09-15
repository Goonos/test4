```sql
**초기 세팅**
SELECT file#, name FROM v$datafile WHERE file# = 7;

ALTER TABLESPACE users BEGIN BACKUP;
!cp -p /u02/oradata/orcl/users01.dbf /fra/backup/hotbackup/
ALTER TABLESPACE users END BACKUP;
Tablespace altered.

INSERT INTO hr.emp83 VALUES (2, 'after hot backup');
COMMIT;
Commit complete.

SELECT * FROM hr.emp83 ORDER BY id;

        ID MEMO
---------- ------------------------------
         1 after cold backup
         2 after hot backup

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

실습 8-5를 마친 상태에서 7번 파일(users01.dbf)의 원래 경로를 확인하고 핫백업을 수행합니다.
테이블에 새로운 데이터를 추가하여 커밋한 후, 로그 스위치와 아카이브를 발생시켜 백업 이후의 변경 사항을 리두 로그와 아카이브 로그에 기록합니다.

**장애 유발**

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

!rm -f /u02/oradata/orcl/users01.dbf

!df -h /u02 /fra

운영체제 레벨에서 7번 데이터파일(users01.dbf)을 강제로 삭제하고 버퍼 캐시를 비워 장애를 유발합니다.
원본 위치(/u02)의 디스크 여유 공간이 부족하여 원래 위치로 파일을 복원할 수 없는 상황을 가정합니다.

**진단**
SELECT COUNT(*) FROM hr.emp83;
ERROR at line 1:
ORA-01116: error in opening database file 7
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-27041: unable to open file

SELECT file#, name, status FROM v$datafile WHERE file# = 7;

     FILE# NAME                                              STATUS
---------- --------------------------------------------- -------
         7 /u02/oradata/orcl/users01.dbf                     RECOVER

SELECT file#, error, change# FROM v$recover_file WHERE file# = 7;

     FILE# ERROR                    CHANGE#
---------- -------------------- -----------
         7 FILE NOT FOUND                 0

!ls -l /fra/backup/hotbackup/users01.dbf

SELECT sequence#, status FROM v$archived_log
  ORDER BY sequence# DESC FETCH FIRST 3 ROWS ONLY;

 SEQUENCE# S
---------- -
        33 A
        32 A
        31 A

!mkdir -p /fra/oradata/ORCL

데이터를 조회하여 파일 접근 에러(ORA-01116)를 발생시키고, 7번 파일의 상태가 자동으로 RECOVER 상태로 변경되었음을 확인합니다.
핫백업 파일과 복구에 필요한 아카이브 로그가 정상적으로 존재하는지 점검하여 완전 복구가 가능함을 판정합니다.
원래 위치의 공간 부족 문제를 해결하기 위해, 새롭게 복원할 대체 경로(/fra/oradata/ORCL)를 준비해 둡니다.

**복구 절차**
ALTER TABLESPACE users OFFLINE IMMEDIATE;
Tablespace altered.

!cp -p /fra/backup/hotbackup/users01.dbf /fra/oradata/ORCL/

SET AUTORECOVERY ON
RECOVER TABLESPACE users;
ORA-00283: recovery session canceled due to errors
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-01115: IO error reading block from file 7 (block # 1)
ORA-01110: data file 7: '/u02/oradata/orcl/users01.dbf'
ORA-27041: unable to open file

SELECT file#, name FROM v$datafile WHERE file# = 7;

     FILE# NAME
---------- ------------------------------------------
         7 /u02/oradata/orcl/users01.dbf

ALTER DATABASE RENAME FILE
   '/u02/oradata/orcl/users01.dbf'
 TO '/fra/oradata/ORCL/users01.dbf';

Database altered.

SELECT file#, name, status FROM v$datafile WHERE file# = 7;

     FILE# NAME                                              STATUS
---------- --------------------------------------------- -------
         7 /fra/oradata/ORCL/users01.dbf                     OFFLINE

RECOVER TABLESPACE users;
Media recovery complete.

테이블스페이스를 강제 오프라인 시킨 뒤 준비한 새 경로(/fra/oradata/ORCL/)로 백업본을 복원합니다.
컨트롤파일의 경로 갱신 없이 곧바로 RECOVER를 시도하면, 오라클은 여전히 예전 원본 경로를 찾기 때문에 복구에 실패(ORA-01115)합니다.
ALTER DATABASE RENAME FILE 명령을 사용해 컨트롤파일 내의 경로를 새 위치로 알려준 뒤에 다시 복구를 시도하여 성공적으로 마칩니다.

**디비 오픈**
ALTER TABLESPACE users ONLINE;

Tablespace altered.

미디어 복구가 정상적으로 완료된 테이블스페이스를 ONLINE 상태로 전환합니다.
```