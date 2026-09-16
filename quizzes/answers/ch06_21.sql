SELECT   TO_CHAR(hire_date, 'YYYY') AS hire_year,
         department_id,
         COUNT(*)                   AS emp_count
FROM     employees
GROUP BY TO_CHAR(hire_date, 'YYYY'), department_id
ORDER BY hire_year, department_id;
