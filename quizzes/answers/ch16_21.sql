SELECT employee_id, last_name, hire_date
FROM   employees e
WHERE  NOT EXISTS (
    SELECT NULL
    FROM   job_history jh
    WHERE  jh.employee_id = e.employee_id
)
ORDER BY hire_date DESC;
