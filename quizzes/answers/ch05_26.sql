SELECT first_name || ' ' || last_name          AS full_name,
       TO_CHAR(hire_date, 'fmDD Month YYYY')   AS hire_date_fmt,
       TO_CHAR(salary, '$99,999')              AS salary_fmt,
       NVL(commission_pct, 0)                  AS commission
FROM   employees
WHERE  department_id IN (50, 80, 90)
ORDER BY hire_date;
