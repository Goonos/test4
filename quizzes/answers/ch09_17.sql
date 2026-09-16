SELECT job_id
FROM   employees
MINUS
SELECT job_id
FROM   job_history
ORDER BY job_id;
