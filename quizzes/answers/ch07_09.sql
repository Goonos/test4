SELECT e.employee_id,
       e.last_name,
       e.department_id AS e_dept,
       d.department_id AS d_dept,
       d.location_id
FROM   employees e
JOIN   departments d
ON     (e.department_id = d.department_id)
WHERE  e.manager_id = 149;
