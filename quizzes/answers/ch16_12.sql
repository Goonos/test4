SELECT employee_id, last_name, salary,
       CASE
           WHEN salary > (SELECT AVG(salary) FROM employees ie
                          WHERE  ie.department_id = oe.department_id)
               THEN 'Above Average'
           WHEN salary < (SELECT AVG(salary) FROM employees ie
                          WHERE  ie.department_id = oe.department_id)
               THEN 'Below Average'
           ELSE 'Average'
       END AS salary_category
FROM   employees oe
ORDER BY salary_category, last_name;
