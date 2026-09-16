DELETE FROM copy_emp
WHERE  salary < (SELECT MAX(salary) FROM copy_emp)
AND    job_id = 'AD_VP';
