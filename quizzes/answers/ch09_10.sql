SELECT job_id
FROM   employees
WHERE  department_id IN (50, 80)
INTERSECT
SELECT job_id
FROM   job_history
ORDER BY job_id;
