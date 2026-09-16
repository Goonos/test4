SELECT   job_id, SUM(salary) AS payroll
FROM     employees
WHERE    job_id NOT LIKE '%REP%'
GROUP BY job_id
HAVING   SUM(salary) > 13000
ORDER BY payroll;
