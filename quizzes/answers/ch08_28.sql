SELECT e.last_name,
       e.salary,
       (SELECT ROUND(AVG(salary))
        FROM   employees e2
        WHERE  e2.department_id = e.department_id) AS dept_avg,
       e.salary - (SELECT ROUND(AVG(salary))
                   FROM   employees e2
                   WHERE  e2.department_id = e.department_id) AS diff
FROM   employees e
WHERE  e.department_id IS NOT NULL
ORDER BY diff DESC
FETCH FIRST 10 ROWS ONLY;
