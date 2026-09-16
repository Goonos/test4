SELECT employee_id
FROM   employees
WHERE  salary > 10000
MINUS
SELECT employee_id
FROM   job_history
ORDER BY employee_id;
