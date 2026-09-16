-- DBA 계정으로 실행
REVOKE select ON hr.locations FROM read_only_role;

SELECT role, privilege, table_name
FROM   role_tab_privs
WHERE  role = 'READ_ONLY_ROLE';

SELECT * FROM hr.locations WHERE ROWNUM <= 3;
