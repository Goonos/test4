SELECT   department_id, ROUND(AVG(salary)) AS avg_salary
FROM     employees
GROUP BY department_id
HAVING   AVG(salary) >= 8000
ORDER BY avg_salary DESC;
