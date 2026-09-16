SELECT   department_id,
         LISTAGG(last_name, ', ')
             WITHIN GROUP (ORDER BY last_name) AS employees_list
FROM     employees
WHERE    department_id IN (50, 60)
GROUP BY department_id
ORDER BY department_id;
