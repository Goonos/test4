SELECT COUNT(*)
FROM   empl7 e
WHERE  salary < (
    SELECT AVG(salary) FROM empl7 WHERE job_id = e.job_id
);

DELETE FROM empl7 e
WHERE salary < (
    SELECT AVG(salary)
    FROM   empl7
    WHERE  job_id = e.job_id
);
