ALTER TABLE dept2 MODIFY department_id PRIMARY KEY;

SELECT constraint_name, constraint_type, status
FROM   user_constraints
WHERE  table_name = 'DEPT2';
