CREATE TABLE empl7_archive_new AS SELECT * FROM empl7 WHERE 1=0;

INSERT INTO empl7_archive_new
SELECT * FROM empl7 WHERE salary >= 12000;

UPDATE empl7 e
SET    salary = salary * 1.1
WHERE  salary >= 12000;

SELECT employee_id, last_name, salary FROM empl7 WHERE salary >= 13200 ORDER BY salary DESC;
COMMIT;
