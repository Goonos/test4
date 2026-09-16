SELECT COUNT(*)
FROM   empl7 e
WHERE NOT EXISTS (SELECT NULL FROM empl7_history WHERE employee_id = e.employee_id);

-- 삭제 실행
DELETE FROM empl7 e
WHERE NOT EXISTS (
    SELECT NULL
    FROM   empl7_history eh
    WHERE  eh.employee_id = e.employee_id
);
