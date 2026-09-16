WITH
dept_totals AS (
    SELECT department_id,
           SUM(salary) dept_total_sal
    FROM   employees
    GROUP BY department_id
),
grand_total AS (
    SELECT SUM(salary) grand_sal
    FROM   employees
)
SELECT dt.department_id,
       dt.dept_total_sal,
       ROUND(dt.dept_total_sal / gt.grand_sal * 100, 2) AS pct_of_total
FROM   dept_totals dt, grand_total gt
ORDER BY pct_of_total DESC;
