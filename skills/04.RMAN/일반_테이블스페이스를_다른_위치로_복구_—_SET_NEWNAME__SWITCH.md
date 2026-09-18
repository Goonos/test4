```sql
-- 데이터파일이 있던 디스크를 더 이상 쓸 수 없다.
-- 다른 디스크로 복원하고 그 위치를 정식 경로로 등록한다.
-- SET NEWNAME과 SWITCH를 짝으로 사용한다.
-- SWITCH를 빠뜨렸을 때 무슨 일이 생기는지 확인한다.
-- 복구 유형 : 완전 복구, 무중단, 파일 위치 변경

**사전 조건**
[세션: Linux OS Shell]
mkdir -p /fra/oradata/ORCL
기존 운영 디스크(/u02)를 쓸 수 없는 상황을 가정하여, 복원할 새로운 디스크 경로(/fra/oradata/ORCL/)를 사전에 준비합니다.

df -h /fra | tail -1

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP TABLESPACE tbs13 TAG 'BASE_152';
실습을 위한 깨끗한 복구 기준점을 만들기 위해 백업을 수행합니다.

**초기 상태 확인**
[세션: RMAN (Target + Catalog 동시 접속)]
REPORT SCHEMA;

[세션: SQL*Plus (SYSDBA)]
CREATE TABLE hr.rec152(id NUMBER, memo VARCHAR2(30)) TABLESPACE tbs13;
INSERT INTO hr.rec152 VALUES (1, 'before failure');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

**장애 유발 : 디스크 사용 불가**
[세션: SQL*Plus (SYSDBA)]
ALTER SYSTEM FLUSH BUFFER_CACHE;

!rm -f /u02/oradata/orcl/tbs13_01.dbf
디스크 장애를 가정하여 해당 데이터파일을 OS 상에서 강제 삭제합니다. (기존 운영 경로 반영)

[세션: 새 터미널 / SQL*Plus (SYSDBA)]
SELECT COUNT(*) FROM hr.incr_test;

**증상 관찰**
[세션: SQL*Plus (SYSDBA)]
SELECT file#, error FROM v$recover_file;

SELECT tablespace_name, status FROM dba_tablespaces WHERE tablespace_name = 'TBS13';

**진단**
[세션: RMAN (Target + Catalog 동시 접속)]
RESTORE TABLESPACE tbs13 PREVIEW SUMMARY;

복구 절차 : 오류 발생 → 원인 파악 → 수정
[세션: RMAN (Target + Catalog 동시 접속)]

RUN {
   SQL 'ALTER TABLESPACE tbs13 OFFLINE IMMEDIATE';
   SET NEWNAME FOR DATAFILE 8 TO '/fra/oradata/ORCL/tbs13_01.dbf';
   RESTORE TABLESPACE tbs13;
   RECOVER TABLESPACE tbs13;
}

SET NEWNAME을 이용해 복원 경로를 새 위치(/fra/oradata/ORCL/)로 지정하여 실행합니다. 파일 복원(RESTORE)은 해당 경로에 정상적으로 끝납니다. 그러나 RECOVER 단계에서 ORA-01157, ORA-01110 에러가 발생하며 실패합니다. SET NEWNAME은 RMAN이 파일을 내려놓을 물리적 위치만 지정할 뿐, 오라클 컨트롤파일의 포인터 정보를 수정해주지 않기 때문에 RECOVER 프로세스가 여전히 옛날 디스크(/u02/...)를 찾아가다 파일이 없어 실패한 것입니다.

[세션: Linux OS Shell]
ls -l /fra/oradata/ORCL/
/fra/oradata/ORCL/에 파일이 물리적으로 잘 복원되어 존재하는지 확인합니다.

sqlplus -s / as sysdba <<< "SELECT file#, name FROM v\$datafile WHERE file#=8;"
컨트롤파일 정보를 담은 v$datafile을 조회해보면, 파일 경로는 여전히 이전 경로인 /u02/oradata/orcl/tbs13_01.dbf를 가리키고 있음을 증명합니다.

[세션: RMAN (Target + Catalog 동시 접속)]

RUN {
   SET NEWNAME FOR DATAFILE 8 TO '/fra/oradata/ORCL/tbs13_01.dbf';
   SWITCH DATAFILE ALL;
   RECOVER TABLESPACE tbs13;
   SQL 'ALTER TABLESPACE tbs13 ONLINE';
}

SWITCH DATAFILE ALL; 명령을 추가하여 실패를 바로잡습니다. RESTORE(또는 이 경우 이미 복원되어 있으므로 생략) 직후 SWITCH를 실행하여 컨트롤파일 내의 경로 정보를 SET NEWNAME으로 지정된 새 경로(/fra/oradata/ORCL/)로 갱신시켜 줍니다. 그 후 RECOVER를 돌리면 바뀐 올바른 경로를 찾아 정상적으로 복구가 완료됩니다.

**검증 및 실무 포인트**
[세션: RMAN (Target + Catalog 동시 접속)]
REPORT SCHEMA;

[세션: SQL*Plus (SYSDBA)]
SELECT * FROM v$recover_file;

SELECT file#, name, status FROM v$datafile WHERE file# = 8;

SELECT id, memo FROM hr.rec152;

INSERT INTO hr.rec152 VALUES (2, 'after recover');
COMMIT;
새로운 디스크 위치(/fra/oradata/ORCL/)로 변경된 테이블스페이스에 데이터를 추가로 입력하여, 쓰기 작업(Write)까지 정상적으로 동작하는지 최종 검증합니다.

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP TABLESPACE tbs13 TAG 'AFTER_MOVE';
파일 경로가 변경되었으므로 복구 기준점과 매니페스트 문서를 갱신하기 위해 해당 테이블스페이스를 즉시 백업받아 둡니다.
```