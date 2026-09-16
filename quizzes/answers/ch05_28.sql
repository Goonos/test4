SELECT last_name,
       salary,
       CASE
           WHEN salary < 5000  THEN 'Low'
           WHEN salary < 10000 THEN 'Medium'
           WHEN salary < 20000 THEN 'High'
           ELSE 'Excellent'
       END AS grade,
       DECODE(TRUNC(salary / 5000, 0),
              0, '5%',
              1, '10%',
              2, '15%',
              '20%') AS tax_rate
FROM   employees
ORDER BY salary DESC;
