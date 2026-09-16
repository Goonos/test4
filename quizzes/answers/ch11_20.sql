SELECT table_name, status, read_only
FROM   user_tables
WHERE  table_name IN ('MY_DEPARTMENTS', 'MY_EMPLOYEES', 'DEPT80_COPY', 'PROJECTS');
