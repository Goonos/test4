CREATE OR REPLACE VIEW top10_emp_vu AS
SELECT employee_id, last_name, salary
FROM   employees WHERE ROWNUM <= 10;

UPDATE top10_emp_vu SET salary = 9999 WHERE employee_id = 100;
