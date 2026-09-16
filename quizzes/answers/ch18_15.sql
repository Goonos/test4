GRANT select ON jobs TO test_user1 WITH GRANT OPTION;

SELECT grantee, privilege, table_name, grantable
FROM   user_tab_privs_made
WHERE  grantee = 'TEST_USER1';
