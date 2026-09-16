SELECT e.last_name, l.city, l.street_address
FROM   employees e
JOIN   departments d ON (e.department_id = d.department_id)
JOIN   locations l   ON (d.location_id = l.location_id)
WHERE  e.department_id = 60;
