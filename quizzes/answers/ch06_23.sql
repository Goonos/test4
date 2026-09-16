SELECT   department_id, job_id, ROUND(AVG(salary), 3) AS avg_salary
FROM     employees
WHERE    department_id IN (60, 80)
GROUP BY department_id, job_id
ORDER BY avg_salary DESC;
