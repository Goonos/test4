SELECT   job_id, COUNT(*) AS emp_count
FROM     employees
GROUP BY job_id
HAVING   COUNT(*) > (SELECT COUNT(*)
                     FROM   employees
                     WHERE  department_id = 80)
ORDER BY job_id;
