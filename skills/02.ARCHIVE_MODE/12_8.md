```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';

!\ls -l /fra/backup/cold12/

!\grep -n 'Completed: ALTER DATABASE CLOSE NORMAL' /u01/app/oracle/diag/rdbms/orcl/orcl/trace/alert_orcl.log | tail -1

STARTUP MOUNT

ALTER DATABASE OPEN RESETLOGS;

SHUTDOWN ABORT

실습 12-7에서 복구 실패를 겪고 디비를 내린 상태에서 날짜 형식을 2026년 기준(YYYY-MM-DD)으로 세팅합니다.
회원님의 백업 경로(/fra/backup/cold12/)에 3종 세트(데이터파일, 컨트롤파일, 리두 로그 파일)가 모두 완벽하게 백업되어 있는지 OS 상에서 점검합니다. Alert 로그를 통해 해당 콜드 백업 직전의 종료 방식이 '정상 종료(CLOSE NORMAL)'였음을 재확인하여 이 백업본이 완벽한 일관성을 가지고 있음을 확정합니다.
현재 디스크에는 실패했던 핫 백업 데이터파일과, 그것을 기반으로 재생성했던 컨트롤파일이 남아있는 상태입니다. 
디비를 올리고(MOUNT) 억지로 열어보려(OPEN RESETLOGS) 시도하지만, 12-7에서 보았던 ORA-01195 에러가 동일하게 반복되며 절대 열리지 않음을 재확인하고 미련 없이 디비를 강제 종료(SHUTDOWN ABORT)합니다.

**증상 관찰 (일부 복원의 위험성 확인)**
!\cp -p /fra/backup/cold12/ *.dbf /u02/oradata/orcl/

STARTUP

SELECT controlfile_type FROM v$database;

SELECT file#, checkpoint_change#, fuzzy FROM v$datafile_header ORDER BY file#;

ALTER DATABASE OPEN RESETLOGS;

3종 세트 중 귀찮다는 이유로 데이터파일(.dbf)만 콜드 백업본으로 덮어써 봅니다.
디비를 기동하면 12-7에서 재생성했던 컨트롤파일이 남아있으므로 MOUNT까지는 정상적으로 올라갑니다.
v$datafile_header를 조회해보면 데이터파일들은 과거 콜드 백업 시점으로 깔끔하게 돌아가 있고 FUZZY도 NO 상태입니다.
하지만 디비를 열려(OPEN RESETLOGS) 시도하면 ORA-01152 에러를 내며 실패합니다. 
원인 파악: 현재 컨트롤파일은 12-7에서 핫 백업본(미래 SCN)을 기준으로 만든 것이고, 데이터파일은 방금 복원한 콜드 백업본(과거 SCN)입니다. 즉 두 파일의 '짝(SCN 일관성)'이 맞지 않아 오라클이 오픈을 거부하는 것입니다. 콜드 백업은 반드시 세 종류가 한 시점에서 짝을 이뤄야 합니다.

**복구 절차 (전체 복원)**
콜드 백업본으로 리커버리 진행

**복구 진단 및 디비 오픈**
STARTUP MOUNT

SELECT controlfile_type FROM v$database;

SELECT file#, checkpoint_change#, fuzzy,
            TO_CHAR(checkpoint_time, 'YYYY-MM-DD HH24:MI:SS') AS checkpoint_time
  FROM  v$datafile_header ORDER BY file#;

SELECT * FROM v$recover_file;

ALTER DATABASE OPEN;

디비를 올리고 MOUNT 상태에서 점검합니다.
컨트롤파일 타입이 CURRENT(정상적인 현재 파일)로 인식되고, 모든 데이터파일의 SCN이 완벽하게 일치하며 FUZZY 상태도 NO입니다. v$recover_file을 조회해봐도 복구 대상이 단 1건도 없습니다.
복구(RECOVER) 작업이 1도 필요 없음을 확인했으므로, 복구 명령이나 RESETLOGS 옵션 없이 시원하게 일반 `ALTER DATABASE OPEN` 명령어를 날려줍니다. 12-7에서 핫 백업으로 그토록 애먹었던 디비가 단 한 번의 에러도 없이 정상적으로 열립니다(최후의 보루, 콜드 백업의 위력).
이때 v$datafile_header에 찍혀있던 `checkpoint_time`이 바로 잃어버린 데이터의 기준 시점(복구 한계점)이므로 오픈 전에 반드시 기록해 두어 현업에 통보할 근거를 남깁니다.
```