UPDATE empl7 e
SET    salary = (
    SELECT j.max_salary * 0.9
    FROM   jobs j
    WHERE  j.job_id = e.job_id
)
WHERE department_id = 80;

-- 확인
SELECT employee_id, last_name, salary, job_id
FROM   empl7
WHERE  department_id = 80
ORDER BY salary DESC;
