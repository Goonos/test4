SELECT first_name, department_id, salary
FROM   employees
WHERE  (salary, department_id) IN
       (SELECT MIN(salary), department_id
        FROM   employees
        GROUP BY department_id)
AND    department_id IN
       (SELECT department_id
        FROM   employees
        GROUP BY department_id
        HAVING MIN(salary) >= (SELECT AVG(salary) FROM employees))
ORDER BY department_id;
