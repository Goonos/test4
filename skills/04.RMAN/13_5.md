```sql
-- 같은 백업 세트에 두 보존 정책을 적용해 판정 결과를 비교한다.
-- REDUNDANCY는 개수 기준, RECOVERY WINDOW는 시점 기준이다.
-- 정책은 판정 기준일 뿐이며 DELETE를 수행해야 실제로 지워진다.
-- 기록 수명이 정책보다 짧을 때 생기는 문제도 확인한다.
-- 작업 유형 : 운영 관리(장애 복구 아님)

RMAN접속>
rman  target "'sys/oracle@orcl as sysdba'" catalog rcatowner/oracle@crmpdb

SHOW RETENTION POLICY;
현재 데이터베이스에 적용되어 있는 백업 보존 정책(Retention Policy)을 확인합니다.

BACKUP AS COMPRESSED BACKUPSET DATAFILE 7 TAG 'RUN1';
BACKUP AS COMPRESSED BACKUPSET DATAFILE 7 TAG 'RUN2';
BACKUP AS COMPRESSED BACKUPSET DATAFILE 7 TAG 'RUN3';
비교 대상을 만들기 위해 7번 데이터파일을 압축 백업 세트 형식으로 세 번 반복해서 백업합니다. 태그(TAG)를 부여하여 각 백업을 직관적으로 식별합니다.

LIST BACKUP OF DATAFILE 7 SUMMARY;
데이터파일 7번에 대해 수행된 백업 세트의 목록과 상태를 요약해서 조회합니다. 기존에 존재하던 백업과 방금 수행한 3개의 백업 등 카탈로그에 등록된 전체 백업 이력을 확인할 수 있습니다.

CONFIGURE RETENTION POLICY TO REDUNDANCY 2;
백업 보존 정책을 개수 기준(REDUNDANCY)으로 변경하여, 각 데이터파일당 최신 백업본 2개만 유지하도록 설정합니다.

REPORT OBSOLETE;
적용된 보존 정책을 기준으로 불필요해진(Obsolete) 백업 및 컨트롤파일 자동 백업 목록을 출력합니다. 개수 기준이므로 날짜와 무관하게 가장 최근 2벌을 제외한 나머지 이전 백업들이 모두 삭제 대상으로 판정됩니다.

CONFIGURE RETENTION POLICY TO RECOVERY WINDOW OF 7 DAYS;
백업 보존 정책을 시점 기준(RECOVERY WINDOW)으로 변경하여, 최근 7일 이내의 어느 시점으로든 복구할 수 있는 상태를 유지하도록 설정합니다.

REPORT OBSOLETE;
시점 기준 보존 정책 하에서 다시 불필요한 백업을 조회합니다. 모든 백업이 당일(최근 7일 내)에 수행되었으므로 Obsolete 대상이 하나도 출력되지 않습니다. 동일한 백업 파일들이라도 적용된 정책 기준에 따라 판정이 완전히 달라짐을 확인합니다.

REPORT NEED BACKUP;
현재 보존 정책(7일 복구 윈도우)을 만족시키기 위해 추가로 백업이 필요한 데이터파일 목록을 확인합니다. 출력되는 파일이 없어야(목록이 비어 있어야) 보존 정책이 온전히 충족된 상태를 의미합니다.

BACKUP AS COMPRESSED BACKUPSET DATABASE TAG 'FULL1';
REPORT NEED BACKUP 결과 보존 정책(7일 윈도우) 요건을 충족하지 못하는 파일들이 존재하므로, 전체 데이터베이스를 백업하여 정책 기준을 충족시킵니다.

REPORT NEED BACKUP;
전체 데이터베이스 백업 수행 후 다시 조회하여, 더 이상 백업이 필요한 파일이 없고 보존 정책이 완벽히 충족되었음을 최종 검증합니다.

CONFIGURE RETENTION POLICY TO REDUNDANCY 2;
REPORT OBSOLETE;
삭제 테스트를 위해 다시 보존 정책을 개수 기준(2벌 유지)으로 변경하고 삭제 대상(Obsolete) 목록을 확인합니다. 새로운 FULL1 백업이 추가됨에 따라 기존의 RUN2 백업과 관련 컨트롤파일 자동 백업까지 삭제 대상으로 밀려난 것을 볼 수 있습니다.

DELETE OBSOLETE;
REPORT OBSOLETE로 판정된 불필요한 백업 파일들을 디스크(물리적 삭제)와 카탈로그(논리적 메타데이터 삭제)에서 실제로 지웁니다. 자동화된 배치 스크립트 환경에서는 사용자 확인 프롬프트를 넘기기 위해 뒤에 NOPROMPT 옵션을 붙여 사용합니다.

SQL접속>
sqlplus / as sysdba

ALTER SYSTEM SET control_file_record_keep_time = 1 SCOPE = BOTH;
컨트롤파일 내의 백업 메타데이터 기록 유지 기간을 보존 정책(7일)보다 훨씬 짧은 1일로 줄여서 고의로 구성 문제를 유발합니다. 이 경우 기록 수명이 짧아 오래된 백업 기록이 지워지므로, 디스크에 백업 파일이 남아있어도 RMAN이 DELETE OBSOLETE 수행 시 삭제 대상을 찾지 못하고 불필요한 파일이 계속 쌓이는 원인이 됩니다.

ALTER SYSTEM SET control_file_record_keep_time = 31 SCOPE = BOTH;
컨트롤파일 기록 수명을 보존 정책 기한(7일)보다 충분히 넉넉한 31일로 늘려 문제를 바로잡습니다. 이를 통해 삭제 주기가 돌아오기 전에 메타데이터가 먼저 유실되는 현상을 방지합니다.
```