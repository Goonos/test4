ALTER TABLE emp2 ENABLE CONSTRAINT emp2_dept_fk;

SELECT constraint_name, status
FROM   user_constraints
WHERE  table_name = 'EMP2' AND constraint_name = 'EMP2_DEPT_FK';
