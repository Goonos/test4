SELECT employee_id
FROM   employees
WHERE  salary >= 8000
INTERSECT
SELECT employee_id
FROM   job_history
ORDER BY employee_id;
