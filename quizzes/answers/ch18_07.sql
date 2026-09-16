GRANT select ON hr.employees   TO read_only_role;
GRANT select ON hr.departments TO read_only_role;
GRANT select ON hr.locations   TO read_only_role;
GRANT select ON hr.jobs        TO read_only_role;

SELECT role, privilege, table_name
FROM   role_tab_privs
WHERE  role = 'READ_ONLY_ROLE'
ORDER BY table_name;
