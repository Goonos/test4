SELECT job_id, avg_salary
FROM   (
    SELECT job_id, AVG(salary) avg_salary
    FROM   employees
    GROUP BY job_id
    ORDER BY avg_salary DESC
)
FETCH FIRST 3 ROWS ONLY;
