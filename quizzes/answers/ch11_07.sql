INSERT INTO mydepartments VALUES (10, 'Sales', 'Busan')
INSERT INTO mydepartments VALUES (20, 'HR', 'Seoul')
INSERT INTO mydepartments VALUES (10, 'IT', 'Daejeon')

--error cood
--ERROR at line 1:
--ORA-00001: unique constraint (HR.SYS_C0011105) violated

--오류원인 - dept_id는 primary key 이기 때문이다.
/
