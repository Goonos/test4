WITH
dept_stats AS (
    SELECT department_id,
           COUNT(*)      emp_count,
           AVG(salary)   avg_sal
    FROM   employees
    GROUP BY department_id
),
top_depts AS (
    SELECT department_id
    FROM   dept_stats
    WHERE  emp_count >= 5
)
SELECT e.last_name, e.salary, e.department_id
FROM   employees e
WHERE  e.department_id IN (SELECT department_id FROM top_depts)
ORDER BY e.salary DESC;
