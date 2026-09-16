DELETE FROM dept7 d
WHERE department_id NOT IN (
    SELECT DISTINCT department_id FROM empl7 WHERE department_id IS NOT NULL
);

DELETE FROM dept7 d
WHERE NOT EXISTS (
    SELECT NULL FROM empl7 e WHERE e.department_id = d.department_id
);

ROLLBACK;
