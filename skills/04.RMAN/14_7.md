```sql
-- 외부 반출용 백업을 비밀번호 방식으로 암호화한다.
-- 암호화 여부를 v$backup_piece 로 확인한다.
-- 비밀번호 없이 복원을 시도해 실패를 확인한다.
-- 복호화 키를 지정한 뒤 복원이 되는 것을 확인한다.
-- 작업 유형 : 백업 보호(장애 복구 아님)

**사전 조건**
[세션: RMAN (Target + Catalog 동시 접속)]
SHOW ENCRYPTION FOR DATABASE;SHOW ENCRYPTION ALGORITHM;
현재 데이터베이스에 설정된 RMAN 암호화 기능 활성화 여부 및 알고리즘을 확인합니다. 기본값은 OFF 상태이며, 알고리즘은 AES128이 지정되어 있습니다.

**초기 상태 확인**
[세션: Linux OS Shell]

sqlplus -s / as sysdba <<< \
"SELECT recid, encrypted, compressed, tag FROM v\$backup_piece
 WHERE status='A' ORDER BY recid DESC FETCH FIRST 3 ROWS ONLY;"
 v$backup_piece 뷰를 조회하여 암호화(ENC) 여부를 확인합니다. (지금까지 받은 모든 기존 백업은 'NO'입니다.)
 
 sqlplus -s / as sysdba <<< "SELECT wrl_type, status FROM v\$encryption_wallet;"
 
 오라클 투명한 데이터 암호화(TDE) 지갑(Wallet)이 구성되어 열려있는지 상태를 점검합니다. 'NOT_AVAILABLE'이므로 투명 암호화 방식은 사용할 수 없고 비밀번호 방식을 사용해야 합니다.

**작업 수행 : 투명 방식 시도**
[세션: RMAN (Target + Catalog 동시 접속)]
CONFIGURE ENCRYPTION FOR DATABASE ON;
데이터베이스 백업 영구 설정을 통해 전체 백업 암호화(지갑을 이용하는 투명 방식)를 켭니다.

BACKUP DATAFILE 7 TAG 'TDE_TRY';
투명 암호화 방식으로 백업을 시도해 봅니다. 하지만 앞서 확인했듯 암호화 키를 관리하는 지갑(Wallet)이 열려있지 않으므로 ORA-19914, ORA-28365 에러가 발생하며 즉각 실패합니다.

CONFIGURE ENCRYPTION FOR DATABASE OFF;

**진행 로그 : 비밀번호 방식 암호화**
[세션: RMAN (Target + Catalog 동시 접속)]
SET ENCRYPTION ON IDENTIFIED BY 'Backup#2025' ONLY;
영구 설정 대신, 현재 작업 세션에만 임시로 적용되는 비밀번호(Password) 기반 암호화를 설정합니다. ONLY를 붙였으므로 지갑 없이 오직 해당 비밀번호로만 풀 수 있는 백업이 됩니다.

BACKUP AS COMPRESSED BACKUPSET DATAFILE 7 FORMAT '/fra/backup/hotbackup/enc_%U' TAG 'ENC_EXPORT';
비밀번호 암호화가 켜진 세션 안에서 7번 데이터파일을 압축 백업합니다. (알려주신 핫 백업 경로 적용)

[세션: Linux OS Shell]
sqlplus -s / as sysdba <<< \
"SELECT recid, encrypted, compressed, ROUND(bytes/1024/1024,1) AS mb, tag
 FROM v\$backup_piece WHERE status='A' ORDER BY recid DESC FETCH FIRST 3 ROWS ONLY;"
 
 뷰를 다시 조회해 봅니다. 새로 생성된 백업 피스(ENC_EXPORT)와 해당 세션에서 뒤따라 수행된 컨트롤파일 자동 백업까지 모두 ENC 컬럼이 'YES'로 암호화되었음을 확인할 수 있습니다.

**진행 로그 : 백업 조각 확인**
[세션: Linux OS Shell]
ls -l /fra/backup/hotbackup/enc_*
물리적 백업 파일의 존재를 확인합니다.

strings /fra/backup/hotbackup/enc_4c52alup_1_1 | grep -c -E '^[A-Z_]{4,}$'
strings /fra/backup/hotbackup/nocomp_3r52alle_1_1 | grep -c -E '^[A-Z_]{4,}$'
strings OS 명령어를 이용해 암호화된 백업 파일과 기존 평문(일반) 백업 파일 내부에 노출되는 영문 텍스트 개수를 비교합니다.

strings /fra/backup/hotbackup/nocomp_3r52alle_1_1 | grep -m5 -E '^[A-Z_]{4,}$'
평문 백업 파일은 내부 구조와 시스템 정보(SYSTEM 등) 문자열이 필터링 없이 그대로 노출됩니다. 외부 반출 시 데이터 유출을 막기 위해 암호화 옵션이 반드시 필요한 이유를 눈으로 직접 증명합니다.

**오류 발생 → 원인 파악 → 수정**
[세션: RMAN (Target 단독 / nocatalog)]
RESTORE DATAFILE 7 VALIDATE FROM TAG 'ENC_EXPORT';
RMAN에 새로운 세션으로 다시 접속하여(기존 암호화 세션 정보가 날아간 상태), 암호화된 백업본의 복원 유효성 검사(VALIDATE)를 시도합니다. 오라클은 복호화를 시도하다 비밀번호를 모르므로 ORA-19913(복호화 불가), ORA-28365(지갑 없음) 에러를 뿜으며 접근을 차단합니다.

SET DECRYPTION IDENTIFIED BY 'WrongPass';
고의로 틀린 비밀번호를 세션에 부여합니다.

RESTORE DATAFILE 7 VALIDATE FROM TAG 'ENC_EXPORT';
틀린 비밀번호를 입력해도 위와 완벽히 동일한 에러를 발생시키며 거부합니다.

SET DECRYPTION IDENTIFIED BY 'Backup#2025';
원래 백업을 수행할 때 입력했던 올바른 복호화 비밀번호를 세션에 설정합니다.

RESTORE DATAFILE 7 VALIDATE FROM TAG 'ENC_EXPORT';
정상적으로 복호화되어 검증(VALIDATE) 단계가 무사히 통과합니다.
```