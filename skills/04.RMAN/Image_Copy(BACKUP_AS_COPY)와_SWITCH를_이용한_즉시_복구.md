```sql
-- 이미지 카피를 만들고 백업 세트와 크기를 비교한다.
-- 데이터파일을 손상시킨 뒤 SWITCH로 즉시 전환해 복구한다.
-- 복원 단계가 사라지는 것을 시간으로 확인한다.
-- 전환 후 데이터파일 위치가 바뀐다는 점과 그 뒷정리를 확인한다.
-- 복구 유형 : 이미지 카피 전환 복구, 손실 없음

**사전 조건**
[세션: Linux OS Shell]
mkdir -p /fra/backup/hotbackup/rmancopy
실습에 사용할 이미지 카피를 저장할 전용 디렉터리를 생성합니다. (알려주신 핫 백업 경로 하위 적용)

df -h /fra/backup | tail -1

**초기 상태 확인**
[세션: RMAN (Target + Catalog 동시 접속)]
SQL 'ALTER SYSTEM ARCHIVE LOG CURRENT';

BACKUP AS BACKUPSET DATAFILE 8 TAG 'BS_COMPARE';
이미지 카피 방식과 크기를 비교하기 위해, 먼저 기존 방식인 '백업 세트(BACKUPSET)' 형식으로 데이터파일을 백업합니다.

[세션: Linux OS Shell]
sqlplus -s / as sysdba <<< "SELECT ROUND(bytes/1024/1024,1) AS mb FROM v\$backup_piece WHERE status='A' AND tag='BS_COMPARE';"
생성된 백업 세트의 실제 크기를 확인합니다. 빈 블록을 건너뛰어 압축·저장하므로 원본 데이터파일(20MB)보다 훨씬 작은 크기(약 6.6MB)로 만들어진 것을 알 수 있습니다.

**작업 수행 : 이미지 카피 생성**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP AS COPY DATAFILE 8 FORMAT '/fra/backup/hotbackup/rmancopy/tbs13_01_copy.dbf' TAG 'COPY_TBS13';
데이터파일을 백업 세트가 아닌, OS 상의 원본 파일과 1:1로 동일한 '이미지 카피(COPY)' 형식으로 백업합니다. 빈 블록까지 그대로 복제하므로 디스크 요구량은 100%입니다.

LIST COPY OF DATAFILE 8;
생성된 데이터파일 이미지 카피본의 목록과 상세 정보(경로, 생성 시간, SCN 등)를 카탈로그에서 조회합니다.

[세션: Linux OS Shell]
ls -l /fra/backup/hotbackup/rmancopy/ /u02/oradata/orcl/tbs13_01.dbf
OS 명령어로 원본 데이터파일과 이미지 카피 파일의 Byte 크기를 직접 비교합니다. 크기가 정확히 일치함을 증명합니다.

**증상 관찰 : 데이터파일 손상**
[세션: SQL*Plus (SYSDBA)]
INSERT INTO hr.incr_test VALUES (9001, 'after copy');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

ALTER SYSTEM FLUSH BUFFER_CACHE;
메모리(Buffer Cache)에 있는 모든 더티 버퍼(수정되었으나 아직 데이터파일에 쓰이지 않은 데이터)를 디스크로 강제 기록(Flush)하고 비웁니다. 더티 버퍼가 남은 채로 디스크 파일을 밖에서 강제 삭제하면, DB 백그라운드 프로세스가 나중에 기록을 시도하다 파일을 찾지 못해 인스턴스 전체를 비정상 종료(Crash)시킬 수 있기 때문입니다.

[세션: Linux OS Shell]
!rm -f /u02/oradata/orcl/tbs13_01.dbf

[세션: SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM hr.incr_test;
OS에서 파일을 강제 삭제했음에도 조회(SELECT) 쿼리가 정상 동작함을 확인합니다. 리눅스 환경에서는 프로세스가 파일 핸들을 아직 물고 있으면 껍데기가 지워져도 메모리를 통해 데이터를 읽어올 수 있습니다.

SELECT file#, error FROM v$recover_file;

!ls -l /u02/oradata/orcl/tbs13_01.dbf

**진단**
[세션: RMAN (Target + Catalog 동시 접속)]
LIST COPY OF DATAFILE 8;

LIST BACKUP OF DATAFILE 8 SUMMARY;

**복구 절차 : 오류 발생 → 원인 파악 → 수정**
[세션: RMAN (Target + Catalog 동시 접속)]
SWITCH DATAFILE 8 TO COPY;
오랜 시간이 걸리는 복원(RESTORE) 과정 없이, 컨트롤파일에 기록된 데이터파일 포인터를 즉시 이미지 카피 경로로 변경(Switch)하려 시도합니다. 단, 아직 해당 파일이 DB 내에서 온라인 상태로 열려있어 거부(RMAN-06572)됩니다.

SQL 'ALTER DATABASE DATAFILE 8 OFFLINE';

SQL 'ALTER DATABASE DATAFILE 8 ONLINE';
오프라인으로 내린 직후 다시 온라인 복귀를 시도해 봅니다. 이제서야 오라클이 지워진 파일의 핸들을 새로 열려다 실패하므로 비로소 파일 부재 에러(ORA-01157, ORA-01110)가 표면으로 드러납니다.

SQL 'SELECT file#, error FROM v$recover_file';

[세션: Linux OS Shell]
sqlplus -s / as sysdba <<< "SELECT file#, error FROM v\$recover_file;"

[세션: RMAN (Target + Catalog 동시 접속)]
SWITCH DATAFILE 8 TO COPY;
파일을 오프라인으로 내린 후 정상적으로 스위치 명령을 재실행합니다. 무거운 파일을 디스크에서 복사(Restore)하는 대신 컨트롤파일 내의 경로 정보만 카피 위치로 즉시 바꾸므로 수 초 만에 끝납니다.

RECOVER DATAFILE 8;

SQL 'ALTER DATABASE DATAFILE 8 ONLINE';

**검증 및 실무 포인트**
[세션: SQL*Plus (SYSDBA)]
SELECT * FROM v$recover_file;

SELECT file#, name, status FROM v$datafile WHERE file# = 8;
전환 결과, 8번 데이터파일의 현재 공식 운영 경로가 원래의 경로(/u02/...)에서 백업본 경로(/fra/backup/hotbackup/rmancopy/...)로 변경되었음을 확인합니다.

SELECT COUNT(*) FROM hr.incr_test WHERE id = 9001;

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP AS COPY DATAFILE 8 FORMAT '/u02/oradata/orcl/tbs13_02.dbf' TAG 'BACK_TO_HOME';
현재 운영 중인 파일이 저성능 디스크(백업 스토리지)에 위치하고 있으므로, 성능 저하를 막기 위해 원래의 운영 디스크 위치(/u02/...)로 다시 '이미지 카피' 백업을 수행하여 되돌아갈 준비(뒷정리)를 합니다.

SQL 'ALTER DATABASE DATAFILE 8 OFFLINE';

SWITCH DATAFILE 8 TO COPY;
다시 한번 SWITCH 명령을 실행하여 컨트롤파일 포인터를 원본 운영 디스크 경로로 원상 복구시킵니다.

RECOVER DATAFILE 8;

SQL 'ALTER DATABASE DATAFILE 8 ONLINE';

LIST COPY OF DATAFILE 8;

[세션: Linux OS Shell]
sqlplus -s / as sysdba <<< "SELECT file#, name FROM v\$datafile WHERE file#=8;"
```