SELECT e.department_id, mx.max_salary,
       e.employee_id, e.last_name
FROM   employees e
JOIN   (
    SELECT department_id, MAX(salary) max_salary
    FROM   employees
    GROUP BY department_id
) mx ON (e.department_id = mx.department_id
         AND e.salary = mx.max_salary)
ORDER BY e.department_id;
