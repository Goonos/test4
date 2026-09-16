INSERT INTO departments VALUES (350, 'Gamma', NULL, 1700);
SELECT department_id, department_name FROM departments WHERE department_id = 350;
COMMIT;
SELECT department_id, department_name FROM departments WHERE department_id = 350;
