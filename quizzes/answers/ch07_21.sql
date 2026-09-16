SELECT e.last_name, e.department_id, d.department_name
FROM   employees e
FULL OUTER JOIN departments d
ON     (e.department_id = d.department_id)
WHERE  e.last_name IS NULL OR d.department_name IS NULL;
