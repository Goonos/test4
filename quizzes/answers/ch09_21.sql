SELECT job_id, 'EMPLOYEE' AS "SOURCE"
FROM   employees
UNION
SELECT job_id, 'MASTER'
FROM   jobs
ORDER BY job_id;
