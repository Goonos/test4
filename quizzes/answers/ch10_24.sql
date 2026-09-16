UPDATE copy_emp SET salary = 99999 WHERE employee_id = 100;
SELECT salary FROM copy_emp WHERE employee_id = 100;  -- 99999
CREATE TABLE temp_test (id NUMBER);
ROLLBACK;
SELECT salary FROM copy_emp WHERE employee_id = 100;
