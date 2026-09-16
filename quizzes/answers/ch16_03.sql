SELECT last_name, salary, department_id
FROM   employees,
       (SELECT AVG(salary) avg_sal FROM employees)
WHERE  salary > avg_sal
ORDER BY salary DESC;
