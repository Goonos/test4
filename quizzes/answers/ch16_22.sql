WITH dept_avg AS (
    SELECT d.department_name,
           AVG(e.salary) avg_salary
    FROM   departments d
    JOIN   employees e ON (d.department_id = e.department_id)
    GROUP BY d.department_name
)
SELECT department_name,
       ROUND(avg_salary, 2) AS avg_salary
FROM   dept_avg
WHERE  avg_salary >= 10000
ORDER BY avg_salary DESC;
