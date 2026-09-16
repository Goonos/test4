SELECT d.department_id, d.department_name,
       (SELECT e.last_name
        FROM   employees e
        WHERE  e.department_id = d.department_id
        AND    e.hire_date = (SELECT MAX(hire_date)
                              FROM   employees
                              WHERE  department_id = d.department_id)
        AND    ROWNUM = 1
       ) AS latest_hire_name
FROM   departments d
ORDER BY d.department_id;

