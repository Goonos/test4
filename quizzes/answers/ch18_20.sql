-- DBA 계정으로 실행
GRANT select ON hr.departments TO PUBLIC;

SELECT grantee, privilege, table_name, owner
FROM   dba_tab_privs
WHERE  table_name = 'DEPARTMENTS' AND owner = 'HR';

-- test_user2 계정에서 실행 (PUBLIC 권한으로 조회 가능)
SELECT department_id, department_name FROM hr.departments WHERE ROWNUM <= 3;

-- PUBLIC 권한 회수
REVOKE select ON hr.departments FROM PUBLIC;
-- 이후 test_user2는 departments 조회 불가
