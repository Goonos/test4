SELECT employee_id, last_name, job_id, salary
FROM   employees e1
WHERE  salary > (
    SELECT AVG(salary)
    FROM   employees e2
    WHERE  e2.job_id = e1.job_id
)
ORDER BY job_id, salary DESC;
