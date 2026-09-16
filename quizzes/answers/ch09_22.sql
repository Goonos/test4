SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 90
UNION ALL
SELECT employee_id, last_name, salary
FROM   employees
WHERE  job_id = 'SA_MAN'
UNION ALL
SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 100
ORDER BY salary DESC;
