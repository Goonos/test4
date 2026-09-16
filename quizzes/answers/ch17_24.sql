ALTER TABLE empl7 ADD team_leader_new VARCHAR2(25);

UPDATE empl7 e
SET    team_leader_new = (
    SELECT last_name
    FROM   empl7
    WHERE  department_id = e.department_id
    AND    salary = (SELECT MAX(salary) FROM empl7 WHERE department_id = e.department_id)
    AND    ROWNUM = 1
);
