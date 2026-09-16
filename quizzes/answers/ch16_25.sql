WITH
top_earner AS (
    SELECT employee_id, last_name, department_id, salary
    FROM   employees
    WHERE  salary = (SELECT MAX(salary) FROM employees)
)
SELECT t.employee_id, t.last_name, t.salary,
       d.department_name, l.city
FROM   top_earner    t
JOIN   departments   d ON (d.department_id = t.department_id)
JOIN   locations     l ON (l.location_id   = d.location_id);
