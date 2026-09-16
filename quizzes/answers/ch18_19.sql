-- DBA 계정으로 실행
REVOKE read_only_role FROM test_user2;

SELECT grantee, granted_role
FROM   dba_role_privs
WHERE  grantee = 'TEST_USER2';

-- test_user2 계정에서 실행 시 (read_only_role 제거됨)
SELECT * FROM hr.employees WHERE ROWNUM <= 3;
