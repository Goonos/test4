-- DBA 계정으로 실행

-- 롤 삭제 (자동으로 부여된 롤도 해제됨)
DROP ROLE read_only_role;
DROP ROLE developer_role;

-- 사용자 삭제 (CASCADE: 소유 객체 함께 삭제)
DROP USER test_user1 CASCADE;
DROP USER test_user2 CASCADE;

-- 정리 확인
SELECT username FROM dba_users
WHERE  username IN ('TEST_USER1', 'TEST_USER2');
-- no rows selected

SELECT role FROM dba_roles
WHERE  role IN ('READ_ONLY_ROLE', 'DEVELOPER_ROLE');
