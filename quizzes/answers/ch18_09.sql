GRANT read_only_role  TO test_user1;
GRANT developer_role  TO test_user1;
GRANT read_only_role  TO test_user2;

SELECT grantee, granted_role, admin_option, default_role
FROM   dba_role_privs
WHERE  grantee IN ('TEST_USER1', 'TEST_USER2')
ORDER BY grantee, granted_role;
