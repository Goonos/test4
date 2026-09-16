```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL name FOR a48

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold/20260915_160000; \mkdir -p /fra/backup/cold/20260915_160000

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260915_160000/

!\rm -f /fra/backup/cold/20260915_160000/temp01.dbf

STARTUP

ALTER DATABASE BACKUP CONTROLFILE TO
    '/fra/backup/control_ch12.bkp' REUSE;

SELECT COUNT(*) AS df_count FROM v$datafile;

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

CREATE TABLE hr.emp122(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp122 VALUES (1, 'after backup');

COMMIT;

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp122 VALUES (2, 'in current redo');

COMMIT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

실습 12-1을 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
안전한 기준점 확보를 위해 디비를 정상 종료하고 회원님의 경로(/fra/backup/)에 전체 콜드 백업과 컨트롤파일 Binary 백업을 새로 받습니다. 
현재 데이터파일이 7개임을 딕셔너리 뷰(v$datafile)와 OS 레벨 명령어로 교차 확인하여 향후 장애 판정의 기준으로 삼습니다.
테스트 테이블을 만들어, 1번 데이터는 백업 이후 아카이브되도록, 2번 데이터는 아카이브되지 않은 CURRENT 리두 그룹(시퀀스 2)에만 머무르도록 분리 입력하여 환경을 조성합니다.


**장애 유발**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/system01.dbf

!\rm -f /u01/app/oracle/oradata/orcl/control01.ctl \
         /u01/app/oracle/oradata/orcl/control02.ctl \
         /u02/oradata/orcl/control03.ctl

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

비정상 종료(SHUTDOWN ABORT)를 수행하여 인스턴스를 죽입니다.
회원님의 실제 데이터파일 경로(/u02/oradata/orcl/)에 있는 수많은 데이터파일들 중, 데이터베이스의 심장인 'system01.dbf' 파일 단 하나만 강제로 삭제합니다.
동시에 여러 경로에 분산된 컨트롤파일(.ctl) 사본 3개까지 모두 강제 삭제해버립니다.
OS에서 확인해보면 데이터파일 7개 중 6개가 살아있고 딱 1개(system01.dbf)만 유실된 상태임을 확인합니다.

**증상 관찰 및 진단**
STARTUP

SELECT status FROM v$instance;

!\tail -6 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log

!\ls /u01/app/oracle/oradata/orcl/ *.ctl /u02/oradata/orcl/ *.ctl 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

!\ls /arch1/ *.arc | wc -l

데이터베이스를 올리면 컨트롤파일이 모두 사라졌기 때문에 ORA-00205 에러가 발생하며 NOMOUNT 상태에서 멈춥니다.
Alert 로그를 통해 파일이 물리적으로 삭제되어 열 수 없음(ORA-00202)을 1차 확인합니다.
OS 명령어를 통해 컨트롤파일은 전손(0개)되었고, 데이터파일은 1개가 날아간 상태(6개 남음)이며, 아카이브 로그 파일들은 손실 없이 완벽하게 생존해 있음을 판정합니다.
진단 결론: 데이터파일 중 단 1개만 지워졌지만 하필 오프라인(OFFLINE)이 절대 불가능한 SYSTEM 데이터파일이 지워졌으므로 서비스 전면 중단이 불가피합니다. 대신 멀쩡한 나머지 6개 파일은 복원할 필요가 없어 복원 시간 자체는 매우 짧습니다.

**복구 절차 (컨트롤파일 및 데이터파일 복원)**
!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control01.ctl
!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control02.ctl

ALTER DATABASE MOUNT;

!\tail -5 /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log

!\cp -p /fra/backup/control_ch12.bkp /u02/oradata/orcl/control03.ctl

ALTER DATABASE MOUNT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT file#, error, change# FROM v$recover_file ORDER BY file#;

!\cp -p /fra/backup/cold/20260915_160000/system01.dbf /u02/oradata/orcl/

SELECT file#, checkpoint_change# FROM v$datafile_header ORDER BY file#;

실수를 가정하여 백업된 컨트롤파일을 2군데 경로에만 복사하고 MOUNT를 시도해봅니다. 파라미터에 명시된 3번째 경로에 파일이 없다며 ORA-00205 에러가 다시 발생합니다.
마지막 3번째 경로(control03.ctl)까지 마저 복사해 넣은 후 다시 ALTER DATABASE MOUNT 명령을 치면 성공적으로 마운트됩니다.
v$recover_file을 조회해 보면, 멀쩡히 살아있는 6개 파일은 쏙 빠지고 오직 사라진 1번 파일(SYSTEM)에 대해서만 FILE NOT FOUND 에러가 잡힙니다. 멀쩡한 파일까지 백업본으로 다 덮어쓰면 복구 시간이 기하급수적으로 늘어나므로, 오직 1번 파일(system01.dbf) 하나만 백업 경로에서 가져와 복원합니다.
v$datafile_header를 조회해보면 1번 파일만 과거(백업 시점)로 돌아가 있고 나머지 파일들은 현재 시점에 머물러 있음을 확인할 수 있습니다.

**복구 절차 (미디어 복구)**
SET AUTORECOVERY ON

RECOVER DATABASE USING BACKUP CONTROLFILE;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE;
-- 프롬프트에서 /u02/oradata/orcl/redo03.log 입력

백업 컨트롤파일을 사용하므로 USING BACKUP CONTROLFILE 옵션을 주고 복구를 시작합니다.
오라클은 뒤처져 있는 1번 파일만을 위해 과거부터 아카이브 로그를 부지런히 적용하다가, 역시나 마지막 CURRENT 구간(시퀀스 2번)에서 파일이 없다며(ORA-00308) 멈춥니다.
자동 복구를 끄고 다시 RECOVER 명령을 수행하여, 시퀀스 2번을 담고 있는 3번 리두 그룹의 멤버 경로(/u02/oradata/orcl/redo03.log)를 직접 입력해 주면 미디어 복구가 성공적으로 끝납니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;
```