CREATE ROLE read_only_role;
CREATE ROLE developer_role;

SELECT role FROM dba_roles
WHERE  role IN ('READ_ONLY_ROLE', 'DEVELOPER_ROLE');
