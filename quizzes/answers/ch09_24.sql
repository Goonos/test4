SELECT employee_id AS "EMP_ID", job_id AS "POSITION", department_id AS "DEPT"
FROM   employees
WHERE  department_id IS NOT NULL
UNION
SELECT employee_id, job_id, department_id
FROM   job_history
ORDER BY employee_id;
