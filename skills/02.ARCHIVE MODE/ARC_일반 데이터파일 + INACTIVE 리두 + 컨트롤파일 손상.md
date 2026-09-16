```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

COL member FOR a44

SHUTDOWN IMMEDIATE

!\rm -rf /fra/backup/cold/20260915_164500; \mkdir -p /fra/backup/cold/20260915_164500

!\cp -p /u02/oradata/orcl/ *.dbf /fra/backup/cold/20260915_164500/

!\rm -f /fra/backup/cold/20260915_164500/temp01.dbf

STARTUP

ALTER DATABASE BACKUP CONTROLFILE TO
    '/fra/backup/control_ch12.bkp' REUSE;

CREATE TABLE hr.emp124(id NUMBER, memo VARCHAR2(30)) TABLESPACE users;

INSERT INTO hr.emp124 VALUES (1, 'after backup');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp124 VALUES (2, 'seq n+1');
COMMIT;
ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.emp124 VALUES (3, 'in current redo');
COMMIT;

SELECT l.group#, l.sequence#, l.archived, l.status, f.member
  FROM  v$log l, v$logfile f WHERE l.group# = f.group# ORDER BY l.group#, f.member;

실습 12-2를 마친 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
안전한 기준점 확보를 위해 디비를 정상 종료하고 회원님의 경로(/fra/backup/)에 전체 콜드 백업과 컨트롤파일 Binary 백업을 새로 받습니다. 
테스트 테이블에 3건의 데이터를 입력하되, 각각 다른 리두 로그 시퀀스에 담기도록 중간중간 아카이브를 발생시킵니다.
v$log를 조회해보면 방금 생성한 아카이브 때문에 그룹 1번(시퀀스 4)과 4번(시퀀스 3)은 INACTIVE 상태가 되었고, 마지막 3번 데이터가 담긴 그룹 3번(시퀀스 5)이 현재 CURRENT 상태임을 확인합니다.

**장애 유발 (특정 디스크 손상 시뮬레이션)**
SHUTDOWN ABORT

!\rm -f /u02/oradata/orcl/users01.dbf

!\rm -f /u02/oradata/orcl/redo01.log /u02/oradata/orcl/redo01b.log

!\rm -f /u01/app/oracle/oradata/orcl/control01.ctl \
         /u01/app/oracle/oradata/orcl/control02.ctl \
         /u02/oradata/orcl/control03.ctl

!\ls /u02/oradata/orcl/ *.log

비정상 종료(SHUTDOWN ABORT)를 수행하여 인스턴스를 죽입니다.
특정 디스크 장애를 묘사하기 위해 회원님의 실제 경로(/u02/oradata/orcl/)에서 다음 3가지를 삭제합니다.
첫째, 일반 데이터파일 중 하나인 `users01.dbf`
둘째, INACTIVE 상태였던 리두 로그 그룹 1번 멤버 전체(`redo01.log`, `redo01b.log`)
셋째, 분산되어 있던 컨트롤파일(.ctl) 사본 3개 모두
OS에서 확인해보면 CURRENT 상태인 리두 로그 3번 그룹 파일들 등은 무사히 살아있음을 알 수 있습니다.

**증상 관찰 및 진단**
STARTUP

SELECT status FROM v$instance;

!\ls /u02/oradata/orcl/ *.dbf | grep -v temp | wc -l

!\ls /u02/oradata/orcl/ *.log 2>/dev/null | wc -l

!\ls /u02/oradata/orcl/ *.ctl 2>/dev/null | wc -l

!\ls /arch1/arch_1_*_*.arc

데이터베이스를 기동(STARTUP)하면 컨트롤파일 전손으로 인해 NOMOUNT 상태에서 ORA-00205 에러가 발생합니다.
OS 명령어를 통해 점검해보면 데이터파일은 1개가 날아갔고(6개 남음), 리두 로그도 일부가 날아갔으며(4개 남음), 컨트롤파일은 전부(0개 남음) 날아갔음을 확인합니다.
하지만 회원님의 아카이브 경로(/arch1)를 확인해보면 방금 삭제된 리두 그룹 1번(시퀀스 4)의 사본이 온전하게 백업되어 존재함을 확인합니다.
진단 결론: 파일 세 종류가 한꺼번에 손상되었지만, 손상된 리두 로그가 이미 아카이브(INACTIVE) 된 상태라 데이터 손실은 '0(Zero)'입니다. 완전 복구가 가능하며, 백업 컨트롤파일을 사용하므로 RESETLOGS 옵션만 강제됩니다.

**복구 절차 (복원 및 권한 문제 시뮬레이션)**
!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control01.ctl
!\cp -p /fra/backup/control_ch12.bkp /u01/app/oracle/oradata/orcl/control02.ctl
!\cp -p /fra/backup/control_ch12.bkp /u02/oradata/orcl/control03.ctl

ALTER DATABASE MOUNT;

SELECT group#, sequence#, archived, status FROM v$log ORDER BY group#;

SELECT group#, member, status FROM v$logfile ORDER BY group#;

SELECT file#, error, change# FROM v$recover_file ORDER BY file#;

!\cp -p /fra/backup/cold/20260915_164500/users01.dbf /u02/oradata/orcl/

SELECT file#, error, change# FROM v$recover_file ORDER BY file#;

!\chmod 555 /u02/oradata/orcl

백업 컨트롤파일을 파라미터 경로에 모두 복사해 넣고 디비를 MOUNT 시킵니다.
v$recover_file을 조회해보면 역시나 전손된 일반 데이터파일(users01.dbf) 하나만 복구 대상으로 잡힙니다. 백업 경로에서 해당 파일 하나만 복사해옵니다. (INACTIVE 리두가 날아간 것은 오라클이 내부적으로 아카이브 사본을 써서 해결하므로 여기서 따로 조치할 필요가 없습니다.)
장애 처리 중 관리자의 실수나 예기치 못한 상황으로 데이터파일이 있는 디렉터리(/u02/oradata/orcl)의 쓰기 권한이 날아간 상황(chmod 555)을 함께 시뮬레이션해둡니다.

**복구 절차 (미디어 복구)**
SET AUTORECOVERY ON

RECOVER DATABASE USING BACKUP CONTROLFILE;

SET AUTORECOVERY OFF

RECOVER DATABASE USING BACKUP CONTROLFILE;
-- 프롬프트에서 /u02/oradata/orcl/redo03.log 입력

백업 컨트롤파일을 쓰므로 USING BACKUP CONTROLFILE 옵션으로 복구를 시작합니다.
오라클이 아카이브 로그를 부지런히 적용하며, 손상되었던 리두 1번 그룹(시퀀스 4) 구간도 아카이브 사본을 통해 무사히 넘깁니다. 
역시나 마지막 CURRENT 구간(시퀀스 5번)에서 아카이브 파일이 없다며 멈추고(ORA-00308), 자동 복구를 끄고 수동(AUTORECOVERY OFF)으로 다시 명령을 내려 프롬프트에 생존해 있던 3번 리두 그룹의 멤버 경로(/u02/oradata/orcl/redo03.log)를 직접 입력해 주면 완벽하게 복구가 마무리(Media recovery complete)됩니다.

**디비 오픈**
ALTER DATABASE OPEN RESETLOGS;
-- ORA-01264, ORA-01262 에러 발생

!\ls -ld /u02/oradata/orcl

!\chmod 755 /u02/oradata/orcl

ALTER DATABASE OPEN RESETLOGS;
```