SELECT employee_id, last_name, job_id
FROM   employees e
WHERE  EXISTS (
    SELECT NULL
    FROM   job_history jh
    WHERE  jh.employee_id = e.employee_id
)
ORDER BY employee_id;
