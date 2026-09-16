SELECT   job_id, SUM(salary) AS total_salary
FROM     employees
GROUP BY job_id
HAVING   SUM(salary) > (SELECT SUM(salary) FROM employees WHERE department_id = 80) / 2
ORDER BY total_salary DESC;
