SELECT employee_id, last_name, salary, department_id
FROM   employees
WHERE  (salary, department_id) IN (
    SELECT salary, department_id
    FROM   employees
    WHERE  employee_id IN (103, 107, 178)
)
AND employee_id NOT IN (103, 107, 178)
ORDER BY department_id, salary;
