SELECT   e.department_id  AS dept_id,
         d.department_name,
         l.city,
         COUNT(*)              AS emp_count,
         ROUND(AVG(e.salary))  AS avg_salary
FROM     employees e
JOIN     departments d ON (e.department_id = d.department_id)
JOIN     locations l   ON (d.location_id = l.location_id)
GROUP BY e.department_id, d.department_name, l.city
ORDER BY e.department_id;
