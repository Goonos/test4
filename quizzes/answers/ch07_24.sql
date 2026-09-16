SELECT e.last_name, d.department_name, l.city
FROM   employees e
LEFT OUTER JOIN departments d ON (e.department_id = d.department_id)
LEFT OUTER JOIN locations l   ON (d.location_id = l.location_id)
ORDER BY e.last_name;
