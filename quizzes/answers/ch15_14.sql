-- ON DELETE SET NULL 확인
DELETE FROM dept2 WHERE department_id = 10;

SELECT employee_id, last_name, department_id
FROM   emp2
WHERE  employee_id IN (
    SELECT employee_id FROM employees WHERE department_id = 10
);
