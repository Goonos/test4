SELECT employee_id, last_name, department_id, salary
FROM   employees oe
WHERE  salary >= 1.5 * (
    SELECT AVG(salary)
    FROM   employees ie
    WHERE  ie.department_id = oe.department_id
)
ORDER BY salary DESC;

