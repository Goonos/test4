SELECT COUNT(*)
FROM   dept7 d
WHERE NOT EXISTS (SELECT NULL FROM empl7 e WHERE e.department_id = d.department_id);

-- 삭제 실행
DELETE FROM dept7 d
WHERE NOT EXISTS (
    SELECT NULL
    FROM   empl7 e
    WHERE  e.department_id = d.department_id
);
