SELECT last_name, hire_date,
       TO_CHAR(hire_date, 'DY') AS hire_day,
       CASE TO_CHAR(hire_date, 'DY')
           WHEN 'MON' THEN 500
           WHEN 'FRI' THEN 300
           ELSE 0
       END AS allowance
FROM   employees;
