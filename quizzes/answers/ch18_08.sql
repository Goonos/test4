GRANT create session, create table, create view,
      create sequence, create procedure
TO    developer_role;

SELECT role, privilege
FROM   role_sys_privs
WHERE  role = 'DEVELOPER_ROLE'
ORDER BY privilege;
