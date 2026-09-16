-- test_user1 계정으로 실행
GRANT select ON hr.jobs TO test_user2;

-- HR 계정으로: 부여된 권한 확인
SELECT grantee, privilege, table_name
FROM   user_tab_privs_made
WHERE  table_name = 'JOBS';
-- TEST_USER1  SELECT  JOBS
-- TEST_USER2  SELECT  JOBS  ← test_user1이 재부여

-- HR이 test_user1 권한 회수
REVOKE select ON jobs FROM test_user1;

-- 연쇄 회수 확인
SELECT grantee, privilege, table_name
FROM   dba_tab_privs
WHERE  table_name = 'JOBS' AND owner = 'HR';
