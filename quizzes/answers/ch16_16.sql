SELECT last_name, department_id, salary
FROM   employees outer_e
WHERE  salary > (
    SELECT AVG(salary)
    FROM   employees inner_e
    WHERE  inner_e.department_id = outer_e.department_id
)
ORDER BY department_id, salary DESC;
