GRANT select ON employees TO test_user1;

SELECT grantee, privilege, table_name
FROM   user_tab_privs_made
WHERE  grantee = 'TEST_USER1';
