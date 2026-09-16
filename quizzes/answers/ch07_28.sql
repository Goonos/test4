SELECT   d.department_name,
         NVL(SUM(e.salary), 0) AS total_salary
FROM     employees e
RIGHT OUTER JOIN departments d
ON       (e.department_id = d.department_id)
GROUP BY d.department_name
ORDER BY total_salary DESC;
