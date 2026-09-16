INSERT INTO copy_emp
SELECT * FROM employees
WHERE  job_id LIKE '%REP%';
