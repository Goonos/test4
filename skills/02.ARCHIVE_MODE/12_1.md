```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL name FOR a48

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold/20260915_150000; \mkdir -p /fra/backup/cold/20260915_150000

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260915_150000/

!\rm -f /fra/backup/cold/20260915_150000/temp01.dbf

STARTUP

ALTER DATABASE BACKUP CONTROLFILE TO
    '/fra/backup/control_ch12.bkp' REUSE;

SELECT file#, name, bytes/1024/1024 AS mb FROM v$datafile ORDER BY file#;
SELECT dbid, name, checkpoint_change# FROM v$database;
SELECT name FROM v$controlfile;

CREATE TABLE hr.emp121(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp121 VALUES (1, 'after backup');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp121 VALUES (2, 'in current redo');

COMMIT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 11-8을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
안전한 베이스라인을 구축하기 위해 데이터베이스를 정상 종료한 뒤 회원님의 백업 경로(/fra/backup/)에 전체 콜드 백업과 컨트롤파일 Binary 백업을 새로 받습니다. 
이후 컨트롤파일 재작성 등의 근거 자료가 될 현재 구조 정보를 매니페스트(manifest) 파일로 스풀링하여 남겨둡니다.
테스트용 테이블을 생성하고, 1번 데이터는 백업 이후 아카이브되도록, 2번 데이터는 아카이브되지 않은 CURRENT 리두 그룹(그룹 3번, 시퀀스 14)에만 머무르도록 트랜잭션을 분리하여 입력합니다.

**장애 유발 (데이터 디스크 손상 시뮬레이션)**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/ *.dbf

!\rm -f /u01/app/oracle/oradata/orcl/control01.ctl \
         /u01/app/oracle/oradata/orcl/control02.ctl \
         /u02/oradata/orcl/control03.ctl

!\ls /u02/oradata/orcl/ *.log

비정상 종료(SHUTDOWN ABORT)를 수행하여 인스턴스를 강제로 죽입니다.
회원님의 실제 데이터파일 경로(/u02/oradata/orcl/)에 있는 모든 데이터파일(.dbf)을 강제로 삭제하여 데이터 디스크가 통째로 날아간 치명적인 상황을 시뮬레이션합니다.
동시에 해당 디스크 및 다른 디스크에 분산되어 있던 컨트롤파일(.ctl) 사본 3개까지 모두 강제 삭제하여 복합 장애 상황을 만듭니다. 
운영체제 레벨에서 확인해보면 리두 로그 파일(.log)들은 다른 디스크(또는 삭제를 면한 경로)에 있어 온전하게 살아있음을 확인합니다.

**증상 관찰 및 진단**
STARTUP

SELECT status FROM v$instance;

SHOW PARAMETER control_files

!\ls /u01/app/oracle/oradata/orcl/ *.ctl /u02/oradata/orcl/ *.ctl 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.dbf 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.log 2>/dev/null | wc -l

데이터베이스를 기동(STARTUP)하면 컨트롤파일을 찾을 수 없어 ORA-00205 에러와 함께 인스턴스가 NOMOUNT 상태에서 멈춥니다.
NOMOUNT 상태에서는 컨트롤파일이 없기 때문에 오라클 내부의 진단 뷰(v$recover_file 등)를 사용할 수 없습니다. 파라미터(SHOW PARAMETER control_files)와 리눅스 OS 명령어(!\ls)만으로 상황을 파악해야 합니다.
OS 확인 결과 데이터파일(0개)과 컨트롤파일(0개)은 전손되었으나, 리두 로그 파일 6개는 모두 온전하게 생존해 있음을 판정합니다.
진단 결론: 데이터파일과 컨트롤파일이 모두 날아간 복합 장애입니다. 이 경우 순서를 지키는 것이 핵심인데, 컨트롤파일을 먼저 살려 디비를 MOUNT 상태로 올려야만 진단 뷰를 보고 데이터파일 복구 전략을 세울 수 있습니다.

**복구 절차 (1단계: 컨트롤파일 확보)**
!\cp -p /fra/backup/cold/20260915_150000/ *.dbf /u02/oradata/orcl/
-- 순서 무시하고 데이터파일부터 덮어써 봄

RECOVER DATABASE;

!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control01.ctl
!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control02.ctl
!\cp -p /fra/backup/control_ch12.bkp /u02/oradata/orcl/control03.ctl

ALTER DATABASE MOUNT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

COL member FOR a44

SELECT group#, member, status FROM v$logfile ORDER BY group#;

순서를 어기고 데이터파일부터 백업본으로 복원한 뒤 RECOVER 명령을 치면, MOUNT 상태가 아니라며 에러(ORA-01507)를 냅니다.
올바른 순서대로, 백업받아둔 컨트롤파일을 파라미터에 정의된 세 군데의 경로 모두에 완벽하게 복사해 넣은 후 ALTER DATABASE MOUNT 명령으로 디비를 마운트 시킵니다.
마운트 후 리두 상태를 확인해보면 v$logfile의 STATUS가 모두 비어있어 리두 로그는 손상 없이 정상임을 알 수 있습니다. 백업 컨트롤파일의 v$log 기록은 과거의 것이므로 13번을 CURRENT로 가리키지만, 실제 현재 CURRENT는 14번임을 유념합니다.

**복구 절차 (2단계: 미디어 복구)**
SELECT file#, error, change# FROM v$recover_file ORDER BY file#;

SET AUTORECOVERY ON

RECOVER DATABASE USING BACKUP CONTROLFILE;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE;
-- 프롬프트에서 /u02/oradata/orcl/redo03.log 입력

v$recover_file을 조회해보면 모든 데이터파일이 백업 시점의 SCN(2440200)에 멈춰있고 ERROR 열이 비어있어 파일 복원은 정상적으로 되었음을 확인합니다.
백업 컨트롤파일을 사용하므로 USING BACKUP CONTROLFILE 옵션을 주어 복구를 시작합니다. 
아카이브는 자동 적용되지만 마지막 CURRENT 구간(시퀀스 14번)은 아직 아카이브 되지 않은 온라인 리두 파일에 있기 때문에 파일을 찾지 못해 ORA-00308을 내며 멈춥니다. 백업 컨트롤파일이 자동 적용을 이끌지 못하는 한계입니다.
자동 복구를 끄고 다시 RECOVER 명령을 수행한 뒤 프롬프트에서 시퀀스 14번을 담고 있는 3번 리두 그룹의 멤버 경로(/u02/oradata/orcl/redo03.log)를 직접 입력해 주면 남은 복구가 깔끔하게 끝납니다(Media recovery complete).

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;
```