SELECT last_name, job_id, department_id
FROM   employees
WHERE  job_id IN (SELECT job_id
                  FROM   employees
                  WHERE  department_id IN (10, 20, 30))
AND    department_id NOT IN (10, 20, 30)
ORDER BY job_id, last_name;
