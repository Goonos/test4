SELECT e.last_name, e.salary, e.department_id,
       d.dept_avg
FROM   employees e
JOIN   (SELECT department_id, ROUND(AVG(salary), 2) AS dept_avg
        FROM   employees
        GROUP BY department_id) d
ON     (e.department_id = d.department_id)
WHERE  e.salary > d.dept_avg
ORDER BY e.department_id, e.salary DESC;
