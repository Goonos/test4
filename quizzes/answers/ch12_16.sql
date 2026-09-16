SELECT c.table_name       AS 자식_테이블,
       cc.column_name     AS FK_열,
       pc.table_name      AS 부모_테이블,
       pcc.column_name    AS PK_열,
       c.delete_rule      AS 삭제_규칙
FROM   user_constraints  c
JOIN   user_cons_columns cc
    ON c.constraint_name = cc.constraint_name AND c.table_name = cc.table_name
JOIN   user_constraints  pc
    ON c.r_constraint_name = pc.constraint_name
JOIN   user_cons_columns pcc
    ON pc.constraint_name = pcc.constraint_name AND pc.table_name = pcc.table_name
WHERE  c.constraint_type = 'R'
ORDER BY c.table_name;
