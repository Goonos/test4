```sql
-- 데이터파일을 추가해 구조를 바꾼 뒤 카탈로그 반영 시점을 확인한다.
-- RESYNC CATALOG로 수동 동기화를 수행한다.
-- Stored Script를 등록하고 실행한다.
-- 크론 연계용 셸 스크립트까지 만들어 본다.
-- 작업 유형 : 운영 관리(장애 복구 아님)

OS접속>
sqlplus -s rcatowner/oracle_4U@rcat <<< "SELECT COUNT(*) FROM rc_datafile;"
OS 셸에서 SQL*Plus 명령을 한 줄로 실행(Here String <<<)하여 복구 카탈로그 DB의 rc_datafile 뷰 레코드 건수를 조회합니다. 대상 DB에 파일이 추가되더라도 RMAN 백업/복구 작업 전까지는 카탈로그에 실시간 반영되지 않는다는 점을 확인하기 위함입니다. (-s 옵션은 불필요한 접속 배너를 숨겨줍니다.)

SQL접속>
CREATE TABLESPACE tbs13 DATAFILE '/u02/oradata/orcl/tbs13_01.dbf' SIZE 20M;

RMAN접속>
REPORT SCHEMA;

RESYNC CATALOG;
대상 데이터베이스 컨트롤파일의 최신 메타데이터를 복구 카탈로그 DB에 수동으로 동기화(반영)합니다. 백업이나 복구 작업 없이 단순 구조 변경만 일어난 상태에서는 카탈로그에 자동 반영되지 않으므로 이 명령이 필요합니다.

SELECT file#, tablespace_name FROM rc_datafile ORDER BY file#;

RMAN>
스크립트 생성
CREATE SCRIPT full_backup COMMENT 'full backup + archivelog + cleanup' {
   BACKUP AS COMPRESSED BACKUPSET DATABASE
     FORMAT '/fra/backup/hotbackup/full_%d_%T_%U'
     TAG 'FULL_DAILY';
   BACKUP ARCHIVELOG ALL DELETE INPUT;
   DELETE NOPROMPT OBSOLETE;
}

CREATE SCRIPT full_backup COMMENT 'full backup + archivelog + cleanup' { ... }
반복적으로 수행되는 RMAN 백업 명령문들을 묶어 카탈로그에 '저장 스크립트(Stored Script)'로 영구 등록합니다. 담당자가 바뀌어도 일관된 백업 절차가 실행되도록 운영 표준을 시스템에 고정하는 역할을 합니다.

LIST SCRIPT NAMES;
복구 카탈로그에 등록되어 있는 Stored Script들의 이름과 주석(Comment) 목록을 조회합니다.

PRINT SCRIPT full_backup;
등록된 특정 Stored Script 내부의 실제 수행될 명령어 세부 내용을 화면에 출력하여 확인합니다.

RUN { EXECUTE SCRIPT full_backup; }
카탈로그에 등록된 Stored Script를 호출하여 실행합니다. EXECUTE SCRIPT 명령어는 프롬프트에서 직접 실행할 수 없으며, 반드시 RUN { } 블록 구문 안에서 실행해야 합니다.

(스크립트 내부에 포함된 신규 명령어)
BACKUP ARCHIVELOG ALL DELETE INPUT;
백업되지 않은 전체 아카이브 로그를 백업함과 동시에, 백업이 성공적으로 끝난 원본 아카이브 로그 파일들을 디스크에서 삭제(DELETE INPUT)하여 공간을 확보합니다. 수행 시 자동으로 현재 로그 스위치를 발생시켜 방금 전까지의 리두 데이터까지 아카이빙한 후 백업에 포함시킵니다.

LIST BACKUP SUMMARY;

REPORT SCHEMA;

PRINT SCRIPT full_backup TO FILE '/home/oracle/rman/full_backup.rmn';
카탈로그 내부에 저장된 스크립트 내용을 외부 OS의 텍스트 파일로 내보냅니다. 스크립트 형상 관리(버전 관리)나 복원 근거 문서로 활용할 수 있습니다.

OS접속>
cat > /home/oracle/rman/full_backup.sh <<'EOS' ...
(crontab -l 2>/dev/null; echo "55 17 * * * ... ") | crontab -
RMAN Stored Script를 OS의 스케줄러(Cron)와 연동하기 위해 셸 스크립트를 생성하고 등록합니다. 크론 실행 환경에서는 사용자의 프로필 환경변수가 로드되지 않으므로 스크립트 내부에 ORACLE_HOME, ORACLE_SID, PATH 등을 명시적으로 선언해야 합니다. 또한 결과 로그 파일에서 RMAN- 문자열을 검색(grep)하는 방식으로 작업의 성공/실패 여부를 판정하도록 구성합니다.
```