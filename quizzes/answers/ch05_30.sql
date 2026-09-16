SELECT first_name || ' ' || last_name            AS full_name,
       TO_CHAR(hire_date, 'fmDD Month YYYY')     AS hire_date_fmt,
       TO_CHAR(salary, '$99,999')                AS salary_fmt,
       TO_CHAR(
           (salary * 12) + (salary * 12 * NVL(commission_pct, 0)),
           '$999,999')                           AS annual_fmt,
       CASE
           WHEN salary < 5000  THEN 'Low'
           WHEN salary < 10000 THEN 'Medium'
           WHEN salary < 20000 THEN 'High'
           ELSE 'Excellent'
       END                                       AS grade,
       'Q' || TO_CHAR(hire_date, 'Q')            AS quarter
FROM   employees
WHERE  hire_date >=