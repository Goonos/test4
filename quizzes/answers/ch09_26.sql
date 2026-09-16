SELECT employee_id
FROM   job_history
INTERSECT
SELECT employee_id
FROM   employees
WHERE  salary >= 10000
ORDER BY employee_id;
