SELECT   job_id, COUNT(*) AS emp_count
FROM     employees
GROUP BY job_id
HAVING   COUNT(*) >= 3
ORDER BY emp_count DESC, job_id;
