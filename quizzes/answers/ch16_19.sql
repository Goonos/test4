SELECT department_id, department_name
FROM   departments d
WHERE  NOT EXISTS (
    SELECT NULL
    FROM   employees e
    WHERE  e.department_id = d.department_id
)
ORDER BY department_id;
