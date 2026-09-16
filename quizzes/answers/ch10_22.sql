UPDATE copy_emp SET salary = 99999 WHERE employee_id = 100;
INSERT INTO departments VALUES (360, 'Delta', NULL, 1700);
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 99999
SELECT department_id FROM departments WHERE department_id = 360;  -- 360
ROLLBACK;
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 24000 (복원)
SELECT department_id FROM departments WHERE department_id = 360;  -- no rows (복원)
