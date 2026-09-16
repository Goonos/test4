-- DBA 계정으로
GRANT create session TO test_user2;

-- test_user2 계정으로 실행
CREATE TABLE test_user2.my_tbl (id NUMBER);
