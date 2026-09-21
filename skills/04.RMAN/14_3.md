```sql
**사전 조건**
[세션: Linux OS Shell]
sqlplus / as sysdba

[세션: SQL*Plus (SYSDBA)]
CREATE TABLE hr.incr_test(id NUMBER, pad VARCHAR2(2000)) TABLESPACE tbs13;

INSERT INTO hr.incr_test SELECT LEVEL, RPAD('x', 2000, 'x') FROM dual CONNECT BY LEVEL <= 2000;

COMMIT;
증분 백업 테스트를 위해 tbs13 테이블스페이스 내부에 샘플용 대용량 데이터를 가진 테이블을 생성하고 데이터를 채워 넣습니다.

**초기 상태 확인**
[세션: RMAN (Target + Catalog 동시 접속)]
LIST BACKUP OF TABLESPACE tbs13 SUMMARY;

**작업 수행 : FULL을 기준으로 시도**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP TABLESPACE tbs13 TAG 'WEEKLY_FULL';
증분 백업의 기준점으로 삼기 위해 전체(FULL) 백업을 먼저 시도합니다. (그러나 RMAN 규칙 상 일반 FULL 백업은 증분 백업의 기준점이 될 수 없습니다.)

BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'L1_AFTER_FULL';
앞서 생성한 FULL 백업을 기준으로 삼을 것이라 오해하고 Level 1 증분 백업을 수행합니다. 에러 없이 완료되지만, 실제로는 Level 0 기준점이 없기 때문에 파일 전체 블록을 백업하게 되어 FULL 백업과 동일한 크기의 'Level 1' 이름만 붙은 무거운 파일이 생성됩니다.

LIST BACKUP OF TABLESPACE tbs13 SUMMARY;

BACKUP INCREMENTAL LEVEL 0 TABLESPACE tbs13 TAG 'L0_WEEKLY';
위의 실수를 바로잡기 위해 정상적인 증분 체계의 기준점이 되는 Level 0 백업을 올바르게 수행합니다.

LIST BACKUP OF TABLESPACE tbs13 SUMMARY;

**진행 로그 : 차등 증분**
[세션: Linux OS Shell]
sqlplus / as sysdba

[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('a',2000,'a') WHERE id <= 400;

COMMIT;
월요일치 업무를 가정하고, 생성해 둔 테이블의 일부 레코드를 변경(Update)하여 데이터 파일 내에 새로운 변경 블록들을 만들어냅니다.

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'L1_DIFF_MON';
월요일분 변경분을 담는 첫 번째 차등 증분(Differential Incremental) 백업을 수행합니다. (Level 1의 기본값이 차등입니다.) 직전 백업(Level 0) 이후의 변경 블록들만 담깁니다.

[세션: Linux OS Shell]
sqlplus / as sysdba

[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('b',2000,'b') WHERE id BETWEEN 401 AND 800;

COMMIT;
화요일치 업무를 가정하여 새로운 블록들을 변경합니다.

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'L1_DIFF_TUE';
화요일분 차등 증분 백업을 수행합니다. 이번에는 직전 Level 1(월요일분) 이후의 변경분만 담깁니다.

LIST BACKUP OF TABLESPACE tbs13 SUMMARY;

**진행 로그 : 누적 증분과 크기 비교**
[세션: Linux OS Shell]
sqlplus / as sysdba

[세션: SQL*Plus (SYSDBA)]
UPDATE hr.incr_test SET pad = RPAD('c',2000,'c') WHERE id BETWEEN 801 AND 1200;

COMMIT;
수요일치 데이터를 변경합니다.

[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'L1_DIFF_WED';
수요일분 차등 증분 백업(직전 화요일 이후 변경분만)을 생성합니다.

BACKUP INCREMENTAL LEVEL 1 CUMULATIVE TABLESPACE tbs13 TAG 'L1_CUM_WED';
비교를 위해 동일한 시점에서 누적 증분(Cumulative Incremental) 백업을 수행합니다. 누적 증분은 직전 Level 1을 무시하고 항상 마지막 Level 0 시점 이후의 모든 변경분을 한꺼번에 담기 때문에 백업 파일 크기가 차등 방식보다 큽니다(월+화+수 누적).

[세션: Linux OS Shell]
sqlplus / as sysdba

[세션: SQL*Plus (SYSDBA)]
SELECT bp.recid, bd.incremental_level AS lv,
       DECODE(bd.incremental_change#, 0, 'BASE',
              TO_CHAR(bd.incremental_change#)) AS from_scn,
       ROUND(bp.bytes/1024/1024, 1) AS mb, bd.blocks, bd.blocks_read, bp.tag
FROM   v$backup_piece bp, v$backup_datafile bd
WHERE  bp.set_stamp = bd.set_stamp AND bp.set_count = bd.set_count
AND    bd.file# = 8 AND bp.status = 'A' AND bp.recid >= 71
ORDER  BY bp.recid;

딕셔너리 뷰(v$backup_piece, v$backup_datafile)를 조인하여 백업 피스들의 실제 블록 수, 백업 파일 크기, 그리고 백업의 기준이 된 SCN(from_scn)을 비교 분석합니다. 차등 증분은 직전 백업 SCN을 기준으로 하고, 누적 증분은 Level 0 백업의 SCN을 기준으로 크기가 커짐을 뷰 결과를 통해 증명합니다.

**오류 발생 → 원인 파악 → 수정**
[세션: RMAN (Target + Catalog 동시 접속)]
BACKUP INCREMENTAL LEVEL 2 TABLESPACE tbs13 TAG 'L2_TRY';
과거 9i 버전까지 사용되던 Level 2 구문으로 백업을 시도합니다. 에러 없이 백업 피스는 만들어집니다.

BACKUP INCREMENTAL LEVEL 1 TABLESPACE tbs13 TAG 'L1_FIXED';
그 직후 다시 Level 1 백업을 받아봅니다. RMAN 10g 이후부터는 0과 1 두 레벨만 지원하므로, 나중에 생성된 Level 1 백업은 앞선 Level 2 백업을 부모(기준점)로 삼지 못하고 Level 0을 기준으로 동작하는 문제점을 유발합니다.

RESTORE TABLESPACE tbs13 PREVIEW SUMMARY;
실제 복원 계획을 PREVIEW 해봅니다. RMAN이 복원 시 Level 2 백업을 아예 참조하지 않고 쓸모없는 파일로 취급하여 계획에서 배제하는 것을 확인할 수 있습니다.

DELETE NOPROMPT BACKUP TAG 'L2_TRY';
복원 시 쓰이지 않는 무효한 Level 2 백업 파일을 삭제하여 불필요한 디스크 낭비를 막습니다.
```