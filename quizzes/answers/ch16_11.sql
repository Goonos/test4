SELECT last_name,
       salary,
       (SELECT ROUND(AVG(salary), 2)
        FROM   employees ie
        WHERE  ie.department_id = oe.department_id) AS dept_avg_salary
FROM   employees oe
ORDER BY salary DESC;
