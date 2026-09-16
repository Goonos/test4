SELECT last_name, salary, department_id
FROM   employees
WHERE  salary > (SELECT AVG(salary) FROM employees)
AND    employee_id IN (SELECT manager_id
                       FROM   employees
                       WHERE  manager_id IS NOT NULL)
AND    department_id IS NOT NULL
ORDER BY salary DESC;
