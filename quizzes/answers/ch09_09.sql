SELECT department_id
FROM   employees
WHERE  department_id IS NOT NULL
INTERSECT
SELECT department_id
FROM   departments
ORDER BY department_id;
