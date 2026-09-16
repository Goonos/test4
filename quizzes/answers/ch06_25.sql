SELECT MAX(AVG(salary)) AS max_of_avg_salary
FROM   employees
GROUP BY department_id;
