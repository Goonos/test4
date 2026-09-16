UPDATE copy_emp
SET    salary = 7000
WHERE  job_id = 'SA_REP'
AND    salary < 7000;

SAVEPOINT after_sa_update;

UPDATE copy_emp
SET    salary = 5000
WHERE  job_id = 'IT_PROG'
AND    salary < 5000;

SELECT job_id, MIN(salary), MAX(salary)
FROM   copy_emp
WHERE  job_id IN ('SA_REP', 'IT_PROG')
GROUP BY job_id;

COMMIT;
