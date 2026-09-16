WITH
sal_groups AS (
    SELECT employee_id,
           salary,
           CASE
               WHEN salary >= 10000 THEN 'High'
               WHEN salary >=  5000 THEN 'Mid'
               ELSE 'Low'
           END AS salary_group
    FROM   employees
)
SELECT salary_group,
       COUNT(*)              AS emp_count,
       ROUND(AVG(salary), 2) AS avg_salary
FROM   sal_groups
GROUP BY salary_group
ORDER BY avg_salary DESC;
