INSERT INTO empl7_history (employee_id, start_date, end_date, job_id, department_id)
SELECT employee_id, hire_date, SYSDATE, job_id, department_id
FROM   employees
WHERE  employee_id IN (100, 101, 176);
