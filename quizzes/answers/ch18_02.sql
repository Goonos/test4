GRANT create session TO test_user1;

SELECT grantee, privilege
FROM   dba_sys_privs
WHERE  grantee = 'TEST_USER1';
