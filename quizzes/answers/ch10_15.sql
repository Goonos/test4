DELETE FROM copy_emp
WHERE  department_id IN (
    SELECT department_id
    FROM   departments
    WHERE  department_name LIKE '%Public%'
);
