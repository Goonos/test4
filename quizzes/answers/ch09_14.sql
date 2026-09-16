SELECT employee_id
FROM   job_history
MINUS
SELECT employee_id
FROM   employees
ORDER BY employee_id;
