CREATE OR REPLACE VIEW emp_dept10_ro_vu
    (employee_number, employee_name, job_title)
AS SELECT employee_id, last_name, job_id
   FROM   employees
   WHERE  department_id = 10
WITH READ ONLY;
