SELECT * FROM user_role_privs;
-- TEST_USER1  DEVELOPER_ROLE  NO  YES  NO
-- TEST_USER1  READ_ONLY_ROLE  NO  YES  NO

SELECT role, privilege, table_name, owner
FROM   role_tab_privs
WHERE  role IN (SELECT granted_role FROM user_role_privs);
