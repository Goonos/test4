SELECT   department_id, job_id, COUNT(*) AS emp_count
FROM     employees
WHERE    department_id > 40
GROUP BY department_id, job_id
ORDER BY department_id, job_id;
