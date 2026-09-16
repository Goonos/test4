SELECT constraint_name
FROM   user_constraints
WHERE  table_name = 'EMPLOYEES'
AND    constraint_type = 'P';
-- 결과: EMP_EMP_ID_PK

SELECT c.table_name      AS 자식_테이블,
       cc.column_name    AS FK_열,
       c.constraint_name AS FK_이름,
       c.delete_rule     AS 삭제_규칙
FROM   user_constraints  c
JOIN   user_cons_columns cc ON c.constraint_name = cc.constraint_name AND c.table_name = cc.table_name
WHERE  c.r_constraint_name = (
    SELECT constraint_name FROM user_constraints
    WHERE  table_name = 'EMPLOYEES' AND constraint_type = 'P'
)
ORDER BY c.table_name;
