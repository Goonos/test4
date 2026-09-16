UPDATE (
    SELECT e.salary, mx.max_sal
    FROM   empl7 e
    JOIN   (
        SELECT department_id, MAX(salary) max_sal
        FROM   empl7
        GROUP BY department_id
    ) mx ON (e.department_id = mx.department_id)
)
SET salary = max_sal;

SELECT department_id, salary
FROM   empl7
WHERE  ROWNUM <= 10
ORDER BY department_id;
