SELECT   department_id             AS dept,
         job_id,
         COUNT(*)                  AS cnt,
         SUM(salary)               AS sum_sal,
         ROUND(AVG(salary))        AS avg_sal
FROM     employees
WHERE    salary > 2000
GROUP BY department_id, job_id
HAVING   SUM(salary) >= 5000
ORDER BY department_id, sum_sal DESC;
