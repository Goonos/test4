UPDATE (
    SELECT employee_id, salary, department_id
    FROM   empl7
    WHERE  department_id = 80
    WITH CHECK OPTION
)
SET department_id = 90
WHERE employee_id = 145;
