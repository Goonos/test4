SELECT first_name, department_id, salary
FROM   employees
WHERE  (salary, department_id) IN
       (SELECT MIN(salary), department_id
        FROM   employees
        GROUP BY department_id)
ORDER BY department_id;
