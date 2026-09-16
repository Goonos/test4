SELECT   department_id          AS dept,
         COUNT(*)               AS emp_count,
         ROUND(AVG(salary))     AS avg_sal,
         MAX(salary)            AS max_sal,
         MIN(salary)            AS min_sal,
         SUM(salary)            AS sum_sal
FROM     employees
WHERE    department_id IN (20, 50, 60, 80, 90)
GROUP BY department_id
HAVING   SUM(salary) >= 50000
ORDER BY avg_sal DESC;
