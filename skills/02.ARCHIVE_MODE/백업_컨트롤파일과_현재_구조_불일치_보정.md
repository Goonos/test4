```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

SELECT file#, name FROM v$datafile ORDER BY file#;

ALTER DATABASE BACKUP CONTROLFILE TO
    '/fra/backup/control_118.bkp' REUSE;

ALTER SYSTEM ARCHIVE LOG CURRENT;

CREATE TABLESPACE tbs11
    DATAFILE '/u02/oradata/orcl/tbs11.dbf' SIZE 20M;

CREATE TABLE hr.emp118 TABLESPACE tbs11
    AS SELECT employee_id, last_name FROM hr.employees;

COMMIT;

DROP TABLESPACE tbs02 INCLUDING CONTENTS AND DATAFILES;

SELECT file#, name FROM v$datafile ORDER BY file#;

ALTER SYSTEM ARCHIVE LOG CURRENT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 11-7을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
현재 데이터파일 상태를 확인하고 회원님의 실제 백업 경로(/fra/backup/)에 컨트롤파일을 먼저 백업합니다. 
백업을 받은 이후에, 13번 데이터파일을 가지는 새로운 테이블스페이스(tbs11)를 생성하여 데이터를 넣고, 기존의 12번 데이터파일을 가지던 테이블스페이스(tbs02)는 삭제하여 물리적 구조를 대폭 변경합니다.
이렇게 하면 조금 전 받아둔 백업 컨트롤파일이 기억하는 구조와 현재 실제 물리적 구조가 완벽하게 어긋나게 됩니다.
아카이브 로그를 생성해 이 구조 변경 내역들을 리두 로그에 안전하게 밀어내어 기록합니다.

**장애 유발**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/ *.ctl

비정상 종료(SHUTDOWN ABORT)를 수행하여 인스턴스를 강제로 죽입니다.
운영체제 레벨에서 회원님의 실제 경로(/u02/oradata/orcl/)에 있는 모든 컨트롤파일(.ctl)을 강제로 삭제하여 컨트롤파일 전손 장애를 발생시킵니다.
구조가 대폭 변경된 이후에 관리자의 실수로 새로운 컨트롤파일 백업을 미처 받지 못한 상황을 가정합니다.

**진단**
STARTUP

SHUTDOWN ABORT

!\cp -p /fra/backup/control_118.bkp /u02/oradata/orcl/control01.ctl
!\cp -p /fra/backup/control_118.bkp /u02/oradata/orcl/control02.ctl
!\cp -p /fra/backup/control_118.bkp /u02/oradata/orcl/control03.ctl

STARTUP MOUNT

SELECT COUNT(*) FROM v$datafile;

SELECT file#, name FROM v$datafile ORDER BY file#;

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp

SELECT file#, error FROM v$recover_file ORDER BY file#;

SELECT MIN(sequence#), MAX(sequence#), COUNT(*),
            MAX(sequence#) - MIN(sequence#) + 1 AS expected
  FROM  v$archived_log
  WHERE  status = 'A'
  AND    resetlogs_change# = (SELECT resetlogs_change# FROM v$database);

디비를 기동하면 컨트롤파일이 없어 NOMOUNT 상태에서 ORA-00205 에러가 발생합니다.
다시 디비를 내리고, 구조 변경 이전에 받아두었던 과거의 컨트롤파일 백업본을 회원님의 실제 디스크 경로에 3중화하여 복원한 후 MOUNT 상태로 올립니다.
v$datafile을 조회해보면 컨트롤파일은 과거의 기억만 갖고 있어 삭제된 12번 파일이 여전히 있다고 착각하고, 새로 추가된 13번 파일은 아예 모르는 상태입니다.
물리적 실제 파일 리스트와 비교해보면 12번은 없고 13번이 존재하는 명확한 불일치(어긋남)를 딕셔너리와 OS 레벨에서 교차 확인합니다.
v$recover_file을 보면 컨트롤파일 기준이므로 12번 파일에 대해 FILE NOT FOUND 에러가 잡혀있습니다.

**복구 절차**
SET AUTORECOVERY ON

RECOVER DATABASE USING BACKUP CONTROLFILE;

ALTER DATABASE DATAFILE 12 OFFLINE DROP;

RECOVER DATABASE USING BACKUP CONTROLFILE;

ALTER DATABASE RENAME FILE
   '/u01/app/oracle/product/19.3.0/dbhome_1/dbs/UNNAMED00013'
TO '/u02/oradata/orcl/tbs11.dbf';

RECOVER DATABASE USING BACKUP CONTROLFILE;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE;

과거 컨트롤파일로 복구를 시도하면 먼저 삭제되었던 12번 파일을 찾지 못해 ORA-01157 에러를 내며 복구가 중단됩니다. 이 파일은 복구 대상에서 제외해야 하므로 OFFLINE DROP 명령으로 12번을 임시로 끊어냅니다.
다시 복구를 이어가면 시퀀스를 순조롭게 적용하다가 컨트롤파일이 모르는 13번 파일 생성 리두 기록을 만나 ORA-01244 에러와 함께 해당 파일을 UNNAMED로 임시 등록하며 복구가 또 멈춥니다.
실제 디스크에는 13번 파일이 멀쩡히 존재하므로 RENAME FILE 명령을 사용해 오라클 엔진이 잡고 있는 UNNAMED 가상 경로를 실제 경로(/u02/oradata/orcl/tbs11.dbf)로 올바르게 연결(보정)해줍니다.
다시 복구를 재개하면 아카이브를 끝까지 적용하다가 아직 아카이브되지 않은 마지막 CURRENT 리두 시퀀스 구간에서 파일이 없다며(ORA-00308) 멈춥니다.
자동 복구를 끄고 수동(AUTORECOVERY OFF)으로 전환한 뒤 복구를 다시 시도하여, 해당 시퀀스를 담고 있는 현재 리두 로그 그룹 1번의 멤버 경로(/u02/oradata/orcl/redo01.log)를 프롬프트에 직접 입력해주면 미디어 복구가 완벽히 완료됩니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;

백업 컨트롤파일을 사용하여 불일치를 보정하며 복구(USING BACKUP CONTROLFILE)를 진행했으므로, 데이터 손실 여부와 무관하게 오라클의 강제 규정에 따라 반드시 RESETLOGS 옵션을 사용하여 데이터베이스를 오픈합니다.
```