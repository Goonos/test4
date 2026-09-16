SELECT last_name, job_id, manager_id, department_id
FROM   employees
WHERE  department_id = 50
AND    (job_id, manager_id) IN
       (SELECT job_id, manager_id
        FROM   employees
        WHERE  department_id = 80);
