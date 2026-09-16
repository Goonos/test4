SELECT   l.city,
         d.department_name,
         COUNT(*)              AS emp_count,
         MAX(e.salary)         AS max_sal,
         MIN(e.salary)         AS min_sal,
         ROUND(AVG(e.salary))  AS avg_sal
FROM     employees e
JOIN     departments d ON (e.department_id = d.department_id)
JOIN     locations l   ON (d.location_id = l.location_id)
GROUP BY l.city, d.department_name
HAVING   COUNT(*) >= 2
ORDER BY l.city, emp_count DESC;
