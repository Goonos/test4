CREATE OR REPLACE VIEW emp_dept50_vu
AS SELECT employee_id, last_name, salary, hire_date, department_id
   FROM   employees
   WHERE  department_id = 50;
