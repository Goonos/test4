ALTER TABLE empl7 ADD mgr_salary NUMBER(8, 2);

UPDATE empl7 e
SET    mgr_salary = (
    SELECT salary
    FROM   empl7
    WHERE  employee_id = e.manager_id
);
