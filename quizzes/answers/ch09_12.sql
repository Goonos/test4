SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
INTERSECT
SELECT department_id
FROM   job_history
ORDER BY department_id;
