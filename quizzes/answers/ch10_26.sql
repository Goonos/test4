INSERT INTO copy_emp (employee_id, first_name, last_name, email,
                      phone_number, hire_date, job_id, salary,
                      commission_pct, manager_id, department_id)
VALUES (209, 'Tom', 'Lee', 'TLEE', '515.000.1111',
        TO_DATE('2024-01-15', 'YYYY-MM-DD'),
        'ST_CLERK', 3200, NULL, 121, 50);

SELECT ROUND(AVG(salary)) AS avg_salary
FROM   copy_emp
WHERE  department_id = 50;

COMMIT;
