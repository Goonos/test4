```sql
/u02 디스크가 통째로 손상되어 그 위의 모든 파일이 사라졌다.
다중화 사본이 살아 있는 /u01 덕분에 복구 경로가 열린다.

장애 유발
SHUTDOWN ABORT

!rm -f /u02/oradata/orcl/.dbf \
/u02/oradata/orcl/.ctl \
/u02/oradata/orcl/.log

증상 관찰
STARTUP
ORA-00205: error in identifying control file, check alert log for more info
MOUNT 조차도 되지 않는다.

처리 순서
멀티플렉싱된 컨트롤 파일을 기존 경로로 복사한다.
콜드백업해둔 데이터 파일을 기존 경로로 복사한다.
리커버 한다.

SHUTDOWN ABORT
STARTUP MOUNT
SET AUTORECOVERY ON
RECOVER DATABASE;
ALTER DATABASE OPEN;

DB가 잘 올라오면 다시 서버를 내리고  리두를 멀티플렉싱 한다.

만약 복원을 기존경로가 아닌 다른 디스크로 간다면 리네임 해줘야한다.
ALTER DATABASE RENAME FILE
'/u01/app/oracle/oradata/ORCL/system01.dbf'
TO '/u03/oradata/ORCL/system01.dbf';
```