SELECT   department_id, ROUND(AVG(salary)) AS avg_salary
FROM     employees
GROUP BY department_id
HAVING   AVG(salary) < (SELECT AVG(salary) FROM employees)
ORDER BY avg_salary;
