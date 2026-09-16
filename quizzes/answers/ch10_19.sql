INSERT INTO departments VALUES (310, 'Test Dept', NULL, 1700);
SAVEPOINT sp1;
INSERT INTO departments VALUES (320, 'Test Dept 2', NULL, 1700);
ROLLBACK TO sp1;
SELECT department_id, department_name
FROM   departments
WHERE  department_id IN (310, 320);
