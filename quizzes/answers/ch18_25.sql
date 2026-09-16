-- DBA 계정으로 실행
ALTER USER test_user1 IDENTIFIED BY NewPass456;

-- 새 암호로 접속 확인 (SQL*Plus 또는 SQL Developer)
-- CONNECT test_user1/NewPass456

-- 접속 성공 후 확인
SELECT USER FROM DUAL;
-- TEST_USER1
