INSERT INTO departments VALUES (330, 'Alpha', NULL, 1700);
SAVEPOINT sp_a;
INSERT INTO departments VALUES (340, 'Beta', NULL, 1700);
SAVEPOINT sp_b;
UPDATE departments SET department_name='Alpha Updated' WHERE department_id=330;
ROLLBACK TO sp_b;
COMMIT;
