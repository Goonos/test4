SELECT employee_id, last_name, department_id, salary
FROM   employees
WHERE  (department_id, salary) IN (
    SELECT department_id, MIN(salary)
    FROM   employees
    GROUP BY department_id
)
ORDER BY department_id;
