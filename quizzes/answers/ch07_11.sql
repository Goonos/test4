SELECT e.last_name, j.job_title, e.salary, j.min_salary, j.max_salary
FROM   employees e
JOIN   jobs j ON (e.job_id = j.job_id)
WHERE  e.salary >= j.max_salary * 0.9
ORDER BY e.salary DESC;
