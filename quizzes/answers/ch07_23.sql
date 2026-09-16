SELECT   d.department_name, COUNT(e.employee_id) AS emp_count
FROM     employees e
RIGHT OUTER JOIN departments d
ON       (e.department_id = d.department_id)
GROUP BY d.department_name
ORDER BY d.department_name;
