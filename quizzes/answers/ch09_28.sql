SELECT employee_id
FROM   employees
WHERE  (salary, department_id) IN
       (SELECT MAX(salary), department_id
        FROM   employees
        GROUP BY department_id)
INTERSECT
SELECT employee_id
FROM   job_history
ORDER BY employee_id;
