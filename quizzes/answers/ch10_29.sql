INSERT INTO departments VALUES (370, 'New Division', 100, 1700);

SAVEPOINT dept_added;

UPDATE copy_emp
SET    department_id = 370
WHERE  department_id = 60;

SELECT COUNT(*) FROM copy_emp WHERE department_id = 370;

ROLLBACK TO dept_added;

SELECT department_id, department_name
FROM   departments
WHERE  department_id = 370;
-- 370  New Division  ← 유지됨

COMMIT;
