WITH dept_avg AS (
    SELECT department_id,
           AVG(salary) avg_salary
    FROM   employees
    GROUP BY department_id
)
SELECT e.employee_id, e.last_name, e.department_id,
       e.salary,
       ROUND(da.avg_salary, 2) AS dept_avg_salary
FROM   employees e
JOIN   dept_avg da ON (e.department_id = da.department_id)
WHERE  e.salary > da.avg_salary * 1.2
ORDER BY e.salary DESC;
