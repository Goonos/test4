SELECT employee_id, last_name, job_id, department_id
FROM   employees mgr
WHERE  EXISTS (
    SELECT NULL
    FROM   employees sub
    WHERE  sub.manager_id = mgr.employee_id
)
ORDER BY employee_id;
