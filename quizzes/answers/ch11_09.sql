
INSERT INTO my_departments VALUES (30, 'Finance', 'Seoul')
INSERT INTO my_employees (emp_id, last_name, email, salary, dept_id)
VALUES (1, 'Park', 'SPARK', 5000, 30)
UPDATE my_employees SET salary = -100 WHERE emp_id = 1
--오류원인 - salary는 >0 제약조건이 있기 때문이다.
/