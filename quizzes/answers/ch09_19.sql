SELECT employee_id, last_name, hire_date
FROM   employees
UNION
SELECT employee_id, job_id, start_date
FROM   job_history
ORDER BY employee_id;
