UPDATE empl7 e
SET    salary = (
    SELECT AVG(salary)
    FROM   empl7
    WHERE  department_id = e.department_id
);

