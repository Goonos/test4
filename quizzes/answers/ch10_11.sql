UPDATE copy_emp
SET    department_id = (SELECT department_id
                        FROM   copy_emp
                        WHERE  employee_id = 100)
WHERE  job_id = 'IT_PROG';
