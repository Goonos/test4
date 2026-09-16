(SELECT employee_id, job_id, department_id
 FROM   employees
 WHERE  department_id IS NOT NULL
 UNION
 SELECT employee_id, job_id, department_id
 FROM   job_history)
MINUS
SELECT employee_id, job_id, department_id
FROM   employees
WHERE  salary < 5000
ORDER BY employee_id;
