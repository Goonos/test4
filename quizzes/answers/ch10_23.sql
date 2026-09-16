UPDATE copy_emp SET salary = 5000 WHERE department_id = 10;
SAVEPOINT after_update;
DELETE FROM copy_emp WHERE department_id = 10;
SELECT employee_id, salary FROM copy_emp WHERE department_id = 10;  -- 0 rows
ROLLBACK TO after_update;
SELECT employee_id, last_name, salary FROM copy_emp WHERE department_id = 10;
