UPDATE empl7 e
SET    salary = (
    SELECT AVG(salary) * 0.9
    FROM   empl7
    WHERE  department_id = e.department_id
)
WHERE  salary < (
    SELECT AVG(salary) * 0.7
    FROM   empl7
    WHERE  department_id = e.department_id
);

-- 갱신 건수 확인
SELECT COUNT(*) updated_count FROM empl7
WHERE salary = (
    SELECT ROUND(AVG(salary) * 0.9, 2)
    FROM   empl7
    WHERE  department_id = empl7.department_id
);
