CREATE USER test_user1 IDENTIFIED BY Oracle123;
CREATE USER test_user2 IDENTIFIED BY Oracle123;

SELECT username, account_status, created
FROM   dba_users
WHERE  username IN ('TEST_USER1', 'TEST_USER2');
