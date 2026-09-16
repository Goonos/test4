SELECT MIN(AVG(salary)) AS min_of_avg_salary
FROM   employees
GROUP BY department_id;
