-- HR 계정으로 실행
SELECT grantee, privilege, table_name, grantable
FROM   user_tab_privs_made
ORDER BY grantee, table_name, privilege;
