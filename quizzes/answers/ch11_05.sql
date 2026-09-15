CREATE TABLE dept80_copy AS
SELECT employee_id, last_name, salary, hire_date
FROM   employees
WHERE  department_id = 80;
/
