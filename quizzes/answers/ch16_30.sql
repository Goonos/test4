WITH dept_max AS (
    SELECT department_id, MAX(salary) max_sal
    FROM   employees
    GROUP BY department_id
)
SELECT e.employee_id, e.last_name, e.department_id, e.salary
FROM   employees e
JOIN   dept_max dm ON (e.department_id = dm.department_id
                       AND e.salary = dm.max_sal)
WHERE  EXISTS (
    SELECT NULL
    FROM   employees sub
    WHERE  sub.manager_id = e.employee_id
)
ORDER BY e.salary DESC;
