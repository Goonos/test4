GRANT update (department_name, location_id)
ON    departments
TO    test_user1;

SELECT grantee, privilege, table_name, column_name
FROM   user_col_privs_made
WHERE  grantee = 'TEST_USER1';
