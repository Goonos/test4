-- test_user1 계정으로 실행

-- 테이블 수준 권한
SELECT owner, table_name, privilege, grantable
FROM   user_tab_privs_recd
ORDER BY owner, table_name;

-- 열 수준 권한
SELECT owner, table_name, column_name, privilege
FROM   user_col_privs_recd
ORDER BY table_name, column_name;
