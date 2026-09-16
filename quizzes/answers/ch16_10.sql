SELECT employee_id, last_name, department_id, job_id
FROM   employees
WHERE  (department_id, job_id) IN (
    SELECT department_id, job_id
    FROM   employees
    WHERE  department_id IN (10, 20, 30)
)
AND department_id NOT IN (10, 20, 30)
ORDER BY department_id, job_id;
