SELECT employee_id, salary, manager_id
FROM   copy_emp
WHERE  salary < (SELECT AVG(salary) FROM copy_emp)
AND    manager_id IS NULL;

UPDATE copy_emp
SET    salary = (SELECT AVG(salary) FROM copy_emp)
WHERE  salary < (SELECT AVG(salary) FROM copy_emp)
AND    manager_id IS NULL;

SAVEPOINT avg_update_done;

SELECT COUNT(*) FROM copy_emp WHERE commission_pct IS NOT NULL;

UPDATE copy_emp
SET    salary = salary * 1.05
WHERE  commission_pct IS NOT NULL;

SELECT employee_id, salary, commission_pct
FROM   copy_emp
WHERE  commission_pct IS NOT NULL
ORDER BY salary DESC;

COMMIT;
