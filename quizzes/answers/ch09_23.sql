SELECT job_id, COUNT(*) AS cnt
FROM   employees
GROUP BY job_id
UNION
SELECT job_id, COUNT(*) AS cnt
FROM   job_history
GROUP BY job_id
ORDER BY 2 DESC;
