CREATE SYNONYM j FOR jobs;

SELECT e.employee_id, e.last_name, j.job_title, e.salary
FROM   emp e
JOIN   j   ON e.job_id = j.job_id
WHERE  e.department_id = 60;
