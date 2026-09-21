```sql
-- 조회 명령으로 백업 현황을 파악한다.
-- 백업 조각 하나를 OS 명령으로 삭제해 기록과 실제의 어긋남을 만든다.
-- CROSSCHECK로 EXPIRED 판정을 확인하고 DELETE EXPIRED로 정리한다.
-- 삭제한 파일을 되돌려 CATALOG 명령으로 다시 등록하는 절차도 확인한다.
-- 작업 유형 : 운영 관리(장애 복구 아님)

RMAN접속>
rman target / catalog rcatowner@rcat

LIST BACKUP SUMMARY;
현재 데이터베이스의 전체 백업 요약 현황을 조회합니다. S 컬럼의 'A'는 백업 파일이 정상적으로 사용 가능한 상태(AVAILABLE)임을 뜻합니다.

LIST BACKUP OF DATAFILE 1;
1번 데이터파일이 포함된 백업 세트의 상세 정보를 조회합니다. 어느 백업 세트에 어떤 파일이 어느 SCN 시점으로 들어 있는지 구체적으로 확인할 수 있습니다.

LIST ARCHIVELOG ALL;
백업된 아카이브 로그의 복사본 목록과 상태를 확인합니다.

LIST BACKUP OF DATAFILE 7;
7번 데이터파일의 백업 세트와 조각(Piece) 이름을 확인합니다. OS 상에서 파일을 임의로 삭제하기 위해 백업 피스의 정확한 물리적 경로(Piece Name)를 확인하는 용도입니다.

OS접속>
cp -p /home/oracle/rmanbk/ORCL_20260917_23_1.bkp /tmp/
rm -f /home/oracle/rmanbk/ORCL_20260917_23_1.bkp
디스크가 찼다는 가정하에 특정 백업 조각을 RMAN 명령이 아닌 OS 명령(rm)으로 직접 삭제합니다. (나중에 복구 테스트를 위해 /tmp에 미리 복사해 둡니다.) 이렇게 하면 RMAN 리포지터리 기록과 실제 디스크 상태 간에 어긋남이 발생합니다.

RMAN접속>
LIST BACKUP SUMMARY;
OS에서 물리적으로 백업 파일을 지웠음에도 여전히 리포지터리 상에서는 상태가 'A(AVAILABLE)'로 표시됩니다. RMAN 카탈로그는 검사를 수행하기 전까지 파일이 사라진 사실을 인지하지 못합니다.

RESTORE DATAFILE 7 FROM TAG 'RUN3' VALIDATE;
물리적으로 삭제된 파일이 포함된 'RUN3' 태그 백업본에 대해 가상으로 복원 유효성 검사(VALIDATE)를 수행합니다. 실제 파일이 지워졌으므로 "No such file or directory" 오류와 함께 실패합니다. 이처럼 가용성 검증이나 실제 복원을 시도해야 비로소 파일 유실 문제가 드러납니다.

LIST BACKUP OF DATAFILE 7 SUMMARY;

RESTORE DATAFILE 7 VALIDATE;
태그를 지정하지 않고 복원 검증을 수행합니다. RMAN은 자동으로 가장 최신 백업(FULL1)을 선택하므로 문제없이 통과합니다. 가장 최신 백업이 정상이라고 해서 과거 백업들까지 모두 정상인 것은 아님을 유의해야 합니다.

DELETE EXPIRED BACKUP;
실제 존재하지 않는 백업 기록을 지우려 시도하지만, 대상을 찾지 못합니다. DELETE 명령은 단순히 기록을 지울 뿐 파일 부재 여부를 스스로 판정하지 않으므로, 먼저 상태를 갱신해 주지 않으면 아무것도 지울 수 없습니다.

CROSSCHECK BACKUP;
RMAN 리포지터리에 기록된 백업 파일들이 실제 디스크나 테이프 위치에 존재하는지 검사합니다. OS에서 삭제된 파일은 이 과정을 거쳐야 비로소 RMAN이 부재를 인지하고 'EXPIRED' 상태로 갱신합니다.

LIST EXPIRED BACKUP SUMMARY;
CROSSCHECK 수행 결과, 물리적 파일이 발견되지 않아 상태(S 컬럼)가 'X(EXPIRED)'로 변경된 백업 목록만 확인합니다.

DELETE NOPROMPT EXPIRED BACKUP;
상태가 EXPIRED로 바뀐 무효한 리포지터리 백업 기록을 완전히 정리하여, RMAN 기록과 실제 디스크 상태를 다시 100% 일치시킵니다.

LIST BACKUP OF DATAFILE 7 SUMMARY;

CROSSCHECK ARCHIVELOG ALL;
DELETE NOPROMPT EXPIRED ARCHIVELOG ALL;
아카이브 로그 백업본에 대해서도 위와 동일하게 실제 파일 존재 여부를 검사하고, 유실된 항목이 있다면 카탈로그 기록을 정리합니다.

OS접속>
cp -p /tmp/ORCL_20260917_23_1.bkp /home/oracle/rmanbk/
앞서 /tmp에 피신시켜 두었던 백업 조각을 원래의 백업 경로로 다시 복사해 가져옵니다.

RMAN접속>
CATALOG BACKUPPIECE '/home/oracle/rmanbk/ORCL_20260917_23_1.bkp';
OS 차원에서 다른 경로에서 가져오거나 되살린 백업 조각을 RMAN 리포지터리에 다시 수동으로 등록합니다. 등록 시 새 Key 값이 부여되며, 백업 피스 내부에 포함된 메타데이터를 읽어 기존의 태그 정보(RUN3)도 함께 복구됩니다.

LIST BACKUP SUMMARY;
RESTORE DATAFILE 7 FROM TAG 'RUN3' VALIDATE;
CATALOG 명령을 통해 리포지터리 기록이 되살아났는지 확인하고, 다시 해당 태그를 조건으로 복원 검증(VALIDATE)을 수행하여 이번에는 정상적으로 유효성 검사가 통과되는지 최종 점검합니다.

REPORT NEED BACKUP;
위 일련의 과정을 거친 후, 현재 데이터베이스가 설정된 백업 보존 정책 요건을 여전히 잘 충족하고 있는지(목록이 비어 있는지) 확인합니다.
```