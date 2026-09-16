SELECT last_name, salary
FROM   employees
WHERE  department_id IN
       (SELECT department_id
        FROM   departments
        WHERE  location_id = 1700)
ORDER BY salary DESC;
