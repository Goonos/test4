SELECT
    employee_id,
    last_name,
    hire_date,
    salary,
    ROUND(salary, -3) AS "round_sal",
    ABS(ROUND(salary, -3) - salary) AS "dif_sal",
    ADD_MONTHS(hire_date, 12) AS "done_date"
FROM
    employees
WHERE
    hire_date >= '01-JAN-00'
ORDER BY add_MonTHS(hire_date, 12)
/
