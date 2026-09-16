SELECT last_name, salary,
       DECODE(TRUNC(salary / 2000, 0),
              0, 0.00,
              1, 0.09,
              2, 0.20,
              3, 0.30,
              4, 0.40,
              0.45) AS tax_rate
FROM   employees
WHERE  department_id = 80;
