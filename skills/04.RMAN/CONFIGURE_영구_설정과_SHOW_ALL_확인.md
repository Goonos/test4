```sql
-- 운영 표준에 맞춰 RMAN 영구 설정을 적용한다.
-- 자동 백업 위치, 보존 정책, 채널 FORMAT, 병렬도를 설정한다.
-- 설정 전후를 SHOW ALL로 비교한다.
-- CLEAR로 되돌리는 절차와 설정을 파일로 남기는 방법을 확인한다.
-- 작업 유형 : 환경 구성(장애 복구 아님)

RMAN접속>
rman  target "'sys/oracle@orcl as sysdba'" catalog rcatowner/oracle@crmpdb
 
CONFIGURE CONTROLFILE AUTOBACKUP ON;
19c 의 기본값과 같은 값이지만 명시하면 # default 가 떨어지고 v$rman_configuration 에기록된다. 운영 표준을 파일로 남길 때 "기본값에 기댄 항목" 이 없도록 하는 뜻이다.

설정할 때마다 카탈로그에도 반영된다(full resync).

CONFIGURE CONTROLFILE AUTOBACKUP FORMAT FOR DEVICE TYPE DISK TO '/home/oracle/rmanbk/cf_%F';
자동 백업되는 컨트롤파일/SPFILE의 저장 경로와 파일명 형식을 지정합니다.
기본 경로(FRA 또는 $ORACLE_HOME/dbs) 대신 지정된 백업 디렉터리로 일원화합니다. %F 포맷은 파일명에 DBID와 날짜(c-DBID-YYYYMMDD-QQ)를 자동 부여하므로, 컨트롤파일을 모두 잃어버리는 재난 상황에서도 파일을 역추적해 복원할 수 있게 만듭니다.
일반 데이터 백업 피스(Backup Piece)의 저장 위치와 파일명 조합 규칙을 정의합니다.
%d: 데이터베이스 이름 (ORCL)  %T: 백업 날짜 (YYYYMMDD)  %s: 백업 세트 번호  %p: 백업 피스 번호

CONFIGURE RETENTION POLICY TO RECOVERY WINDOW OF 7 DAYS;
최근 7일 전 어느 시점으로든 복구(Point-in-Time Recovery)할 수 있는 상태를 유지하도록 백업 보존 정책을 정의합니다.

CONFIGURE DEVICE TYPE DISK PARALLELISM 2 BACKUP TYPE TO BACKUPSET;
디스크 백업 시 동시에 작동할 채널(서버 프로세스) 수를 2개로 지정하고, 백업 형식을 백업 세트(압축/빈 블록 제외 지원)로 고정합니다.

CONFIGURE CHANNEL DEVICE TYPE DISK FORMAT '/home/oracle/rmanbk/%d_%T_%s_%p.bkp';

CONFIGURE ARCHIVELOG DELETION POLICY TO BACKED UP 1 TIMES TO DISK;
아카이브 로그를 디스크에 최소 1회 이상 백업받았을 때만 삭제 가능한 상태로 인정합니다.

ALTER SYSTEM SET control_file_record_keep_time = 31 SCOPE = BOTH;

BACKUP DATAFILE 7;
채널이 두 개 할당되었다. 병렬도 설정이 적용되었다.
파일 하나뿐이라 실제 작업은 채널 1 이 다 했다.

CONFIGURE SNAPSHOT CONTROLFILE NAME CLEAR;
스냅샷 컨트롤파일 저장 경로 설정을 지우고 기본값으로 초기화합니다.

SHOW SNAPSHOT CONTROLFILE NAME;
스냅샷 컨트롤파일 경로 설정을 조회합니다.
CLEAR를 통해 오라클 기본 경로($ORACLE_HOME/dbs/snapcf_orcl.f)로 안전하게 되돌아갔는지 확인합니다.

BACKUP DATAFILE 7;
경로 오류를 수정한 후, 데이터파일 백업과 뒤이어 실행되는 컨트롤파일 자동 백업까지 모두 에러 없이 완벽하게 끝나는지 최종 검증합니다.
```