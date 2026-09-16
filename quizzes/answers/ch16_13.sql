SELECT employee_id, last_name, department_id
FROM   employees oe
ORDER BY (
    SELECT COUNT(*)
    FROM   employees ie
    WHERE  ie.department_id = oe.department_id
) DESC, department_id;
