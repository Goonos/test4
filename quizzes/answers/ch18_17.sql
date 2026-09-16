-- HR 계정으로 실행
REVOKE update ON departments FROM test_user1;

SELECT grantee, privilege, table_name, column_name
FROM   user_col_privs_made
WHERE  grantee = 'TEST_USER1';
