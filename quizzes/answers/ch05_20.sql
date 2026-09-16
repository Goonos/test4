SELECT last_name, salary,
       CASE
           WHEN salary < 5000  THEN 'Low'
           WHEN salary < 10000 THEN 'Medium'
           WHEN salary < 20000 THEN 'High'
           ELSE 'Excellent'
       END AS salary_grade
FROM   employees;
