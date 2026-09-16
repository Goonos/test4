SELECT   department_id, job_id, COUNT(*) AS emp_count
FROM     employees
GROUP BY department_id, job_id
HAVING   COUNT(*) >= 2
ORDER BY department_id, emp_count DESC;
