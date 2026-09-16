SELECT last_name, job_id, hire_date
FROM   employees
WHERE  (job_id, hire_date) IN
       (SELECT job_id, MAX(hire_date)
        FROM   employees
        GROUP BY job_id)
ORDER BY job_id;
