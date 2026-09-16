SELECT department_id,
       LISTAGG(last_name, ', ')
           WITHIN GROUP (ORDER BY last_name) AS employees_list
FROM   employees
WHERE  department_id = 20
GROUP BY department_id;
