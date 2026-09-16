SELECT d.department_id, d.department_name
FROM   departments d
WHERE  d.department_id IN (
    SELECT department_id FROM departments
    MINUS
    SELECT department_id FROM employees WHERE department_id IS NOT NULL
)
ORDER BY d.department_id;
