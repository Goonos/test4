SELECT employee_id, last_name, salary
FROM   employees
WHERE  salary > ALL (SELECT salary
                     FROM   employees
                     WHERE  department_id = 90)
AND    department_id <> 90
ORDER BY salary DESC;
