SELECT e.last_name, d.department_name
FROM   employees e
LEFT OUTER JOIN departments d
ON     (e.department_id = d.department_id
        AND d.department_name = 'Sales');
