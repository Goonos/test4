ALTER TABLE dept2 RENAME TO dept_backup;
ALTER TABLE emp2  RENAME TO emp_backup;

SELECT table_name FROM user_tables
WHERE  table_name IN ('DEPT_BACKUP','EMP_BACKUP');

-- 원래 이름으로 복원
ALTER TABLE dept_backup RENAME TO dept2;
ALTER TABLE emp_backup  RENAME TO emp2;
