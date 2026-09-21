```sql
상황 1 종료 상태에서 유실
SHUTDOWN IMMEDIATE
!rm -f /u01/app/oracle/oradata/ORCL/temp01.dbf

STARTUP
정상적으로 올라옴
temp는 자동 재생성됨

상황 2 열린 상태에서 유실

!rm -f /u01/app/oracle/oradata/ORCL/temp01.dbf

SELECT * 
FROM (SELECT object_name FROM dba_objects ORDER BY object_name) 
WHERE ROWNUM <= 3;
일반 셀렉트와 작은 정렬은 정상이지만 큰 정렬은 에러 발생된다.

없어진 파일을 먼저 제거해 본다.
ALTER DATABASE TEMPFILE '/u01/app/oracle/oradata/ORCL/temp01.dbf' DROP
다시 큰 정렬을 할 겨우 에러가 발생한다.
 << 원인 파악 >>
 오류가 ORA-01116에서 ORA-01652로 바뀌었다.
 이제는 "파일을 열 수 없다"가 아니라 "확장할 공간이 없다"는 뜻이다.
 제거를 먼저 한 탓에 정렬에 쓸 파일이 하나도 없는 공백이 생겼다.
 추가를 먼저 하고 제거를 나중에 해야 이런 공백이 생기지 않는다.

대체 파일을 먼저 생성 후 삭제
ALTER TABLESPACE temp ADD TEMPFILE
'/u01/app/oracle/oradata/ORCL/temp02.dbf' SIZE 60M;
다시 정렬할경우 정상적으로 진행된다.

해결방법 2
테이블스페이스 자체를 교체한다.
CREATE TEMPORARY TABLESPACE temp2
TEMPFILE '/u01/app/oracle/oradata/ORCL/temp03.dbf' SIZE 100M;

ALTER DATABASE DEFAULT TEMPORARY TABLESPACE temp2;

DROP TABLESPACE temp INCLUDING CONTENTS AND DATAFILES;

SELECT property_value FROM database_properties
WHERE  property_name = 'DEFAULT_TEMP_TABLESPACE';

PROPERTY_VALUE
---------------
TEMP2
```