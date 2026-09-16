SELECT employee_id, department_id
FROM   copy_emp
WHERE  department_id NOT IN (
    SELECT department_id FROM departments WHERE department_id IS NOT NULL)
OR     department_id IS NULL;


UPDATE copy_emp
SET    department_id = NULL
WHERE  department_id NOT IN (
    SELECT department_id FROM departments WHERE department_id IS NOT NULL)
AND    department_id IS NOT NULL;


COMMIT;
