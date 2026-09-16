SELECT department_id, avg_salary, emp_count
FROM   (SELECT department_id,
               ROUND(AVG(salary)) AS avg_salary,
               COUNT(*)           AS emp_count
        FROM   employees
        GROUP BY department_id
        ORDER BY avg_salary DESC)
WHERE  ROWNUM <= 5;
