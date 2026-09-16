UPDATE copy_emp
SET    (job_id, salary) = (SELECT job_id, salary
                            FROM   copy_emp
                            WHERE  employee_id = 205)
WHERE  employee_id = 200;
