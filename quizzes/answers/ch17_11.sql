ALTER TABLE empl7 ADD dept_name VARCHAR2(30);

UPDATE empl7 e
SET    dept_name = (
    SELECT department_name
    FROM   departments d
    WHERE  d.department_id = e.department_id
);

-- 확인
SELECT employee_id, last_name, department_id, dept_name
FROM   empl7
WHERE  ROWNUM <= 10;
