INSERT INTO employees (
    employee_id,
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id
) VALUES (
    208,
    'Alice',
    'Kim',
    'AKIM',
    '515.123.8888',
    TO_DATE('15-JAN-2020', 'DD-MON-YYYY'),
    'SA_REP',
    8500,
    0.15,
    145,
    80)
/
