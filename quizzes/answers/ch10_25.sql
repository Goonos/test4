TRUNCATE TABLE copy_emp;
INSERT INTO copy_emp SELECT * FROM employees;
DELETE FROM copy_emp WHERE salary < 6000;
SELECT COUNT(*) FROM employees WHERE salary < 6000;
ROLLBACK;
