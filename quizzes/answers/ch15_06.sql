ALTER TABLE dept2 DROP PRIMARY KEY CASCADE;

-- emp2의 FK 확인
SELECT constraint_name, constraint_type, status
FROM   user_constraints
WHERE  table_name = 'EMP2' AND constraint_name = 'EMP2_DEPT_FK';
