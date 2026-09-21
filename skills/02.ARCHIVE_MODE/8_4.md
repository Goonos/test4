```sql
**초기 세팅**
SET LINESIZE 200
COL name FOR a48

!ls /fra/backup/cold/20260907_100053/ *.dbf

CREATE TABLESPACE tbs01 DATAFILE '/u02/oradata/orcl/tbs02.dbf' SIZE 20M;
Tablespace created.

SELECT file#, name, creation_change#, creation_time
FROM v$datafile WHERE name LIKE '%tbs02%';

     FILE# NAME                                             CREATION_CHANGE# CREATION
---------- ------------------------------------------ ---------------- --------
        11 /u02/oradata/orcl/tbs02.dbf                               2406240 11-MAY-25

CREATE TABLE hr.emp85 TABLESPACE tbs01 AS SELECT * FROM hr.employees;
Table created.

INSERT INTO hr.emp85 SELECT * FROM hr.employees;
107 rows created.

COMMIT;

SELECT COUNT(*) FROM hr.emp85;

  COUNT(*)
----------
       214

ALTER SYSTEM SWITCH LOGFILE;
ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

콜드 백업 디렉토리에 이전 실습의 백업본들이 존재하는지 확인한 후, 백업 이후 시점에 새로운 테이블스페이스(tbs01)를 생성합니다.
컨트롤파일에 기록된 해당 데이터파일의 생성 SCN(CREATION_CHANGE#)을 확인하고, 새 테이블스페이스에 테스트 데이터를 입력한 후 커밋합니다.
강제 로그 스위치와 아카이브를 발생시켜 테이블스페이스 생성 이후의 모든 데이터 변경 내역이 아카이브 로그에 기록되도록 합니다.

**장애 유발**
!rm -f /u02/oradata/orcl/tbs02.dbf

ALTER SYSTEM FLUSH BUFFER_CACHE;
System altered.

백업본이 전혀 없는 상태에서 운영체제 명령어를 통해 새로 생성한 테이블스페이스의 데이터파일(tbs01.dbf)을 강제로 삭제하여 유실 상황을 유발합니다.
버퍼 캐시를 비워 오라클이 해당 데이터파일의 데이터를 디스크에서 직접 읽도록 유도함으로써 장애를 즉시 인지하게 만듭니다.

**진단**
SELECT COUNT(*) FROM hr.emp85;
ERROR at line 1:
ORA-01116: error in opening database file 11
ORA-01110: data file 11: '/u02/oradata/orcl/tbs01.dbf'
ORA-27041: unable to open file

얼럿 로그를 통해 확인된 명확한 원인과 흐름은 다음과 같습니다.

버퍼 캐시 플러시와 체크포인트 발생: ALTER SYSTEM FLUSH BUFFER_CACHE; 명령을 실행하면 메모리(버퍼 캐시)에 있던 더티 블록(변경된 데이터)을 디스크로 강제로 내려쓰게 되며, 이 과정에서 체크포인트(Checkpoint) 작업이 동반됩니다.

CKPT 프로세스의 파일 헤더 접근 실패: 체크포인트가 발생하면 CKPT 백그라운드 프로세스는 데이터베이스를 구성하는 모든 데이터파일의 헤더에 현재 SCN(System Change Number)을 기록해야 합니다. 하지만 OS에서 tbs02.dbf(10번 파일)를 이미 삭제했기 때문에 접근에 실패했습니다.

Errors in file ... orcl_ckpt_15038.trc (CKPT 프로세스 에러 발생)

ORA-01116: error in opening database file 10

Linux-x86_64 Error: 2: No such file or directory (OS 레벨 파일 없음)

필수 백그라운드 프로세스 사망으로 인한 인스턴스 종료: 오라클 아키텍처 상 CKPT, DBWn, LGWR, SMON, PMON 등은 인스턴스 유지에 필수적인 핵심 백그라운드 프로세스입니다. CKPT가 파일 헤더 업데이트에 실패하여 작업을 완수하지 못하고 뻗어버리면, 오라클은 데이터 정합성이 깨지는 것을 막기 위해 스스로 인스턴스를 강제 종료(Abnormal Instance Termination) 시킵니다.

System state dump requested by (instance=1, osid=15038 (CKPT)), summary=[abnormal instance termination]

요약:
단순히 데이터파일이 지워졌다고 해서 즉시 DB가 죽지는 않습니다(실습 8-1처럼 해당 파일만 오프라인 처리됨). 하지만 인스턴스 전역에 영향을 미치는 체크포인트 상황에서 CKPT 프로세스가 유실된 파일의 헤더에 쓰기 작업을 시도하다가 실패하면, 데이터베이스를 보호하기 위해 인스턴스 전체가 스스로 셧다운 다운됩니다.

**복구 절차**
ALTER DATABASE DATAFILE 10 OFFLINE;

ALTER DATABASE OPEN;

ALTER DATABASE CREATE DATAFILE 10 AS '/u02/oradata/orcl/tbs02.dbf';

SET AUTORECOVERY ON
RECOVER TABLESPACE tbs01;
Media recovery complete.

손상된 파일은 체크포인트 수행이 불가능하므로 OFFLINE NORMAL 시도는 에러를 발생시킵니다.
OFFLINE IMMEDIATE를 사용하여 강제로 오프라인 처리한 후, CREATE DATAFILE 명령을 통해 운영체제 상에 빈 껍데기 파일(크기는 원본과 동일)을 새로 생성합니다.
생성된 빈 파일의 복구 시작 SCN이 컨트롤파일의 파일 생성 SCN과 동일함을 확인하고, RECOVER 명령을 수행하여 파일 생성 시점부터 누적된 아카이브 리두를 빈 파일에 전부 밀어 넣어 복구를 완료합니다.

**디비 오픈**
ALTER TABLESPACE tbs01 ONLINE;

Tablespace altered.

미디어 복구가 정상적으로 완료되었으므로, 복구된 테이블스페이스를 ONLINE 상태로 전환하여 데이터베이스 무중단 상태에서 서비스를 재개합니다.

**DB정상 확인**
SELECT * FROM v$recover_file;

no rows selected

SELECT COUNT(*) FROM hr.emp85;

  COUNT(*)
----------
       214

SELECT file#, name, status, bytes/1024/1024 AS mb
  FROM v$datafile WHERE file# = 11;

     FILE# NAME                                             STATUS     MB
---------- ------------------------------------------ ------- -----
        11 /u02/oradata/orcl/tbs01.dbf                    ONLINE     20

SELECT resetlogs_change# FROM v$database;

RESETLOGS_CHANGE#
-----------------
                1

CREATE TABLE hr.emp85n TABLESPACE tbs01 NOLOGGING
  AS SELECT * FROM hr.employees;
Table created.

SELECT table_name, logging FROM dba_tables
  WHERE  table_name IN ('EMP85','EMP85N');

TABLE_NAME LOG
---------- ---
EMP85      YES
EMP85N     NO

SELECT name, force_logging FROM v$database;

NAME      FOR
--------- ---
ORCL      NO

더 이상 복구할 파일이 없는지 확인하고, 백업본이 없었음에도 아카이브 로그만으로 데이터가 완벽하게 복원되었는지 테이블 조회로 검증합니다.
데이터파일의 ONLINE 상태와 리셋로그 이력이 변함없이 유지되고 있음을 확인합니다.
추가로 NOLOGGING 옵션을 적용해 테이블을 생성해 봄으로써, 리두 로그를 남기지 않는 NOLOGGING 작업은 빈 파일 리두 적용 방식(CREATE DATAFILE)으로 복구할 수 없음을 이해하고 실무적으로 NOLOGGING 작업 직후 백업의 필요성을 확인하며 마칩니다.
```