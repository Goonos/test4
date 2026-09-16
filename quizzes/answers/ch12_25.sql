SELECT t.table_name,
       t_col.col_count,
       NVL(t_con.constraint_count, 0) AS constraint_count,
       ROUND(NVL(nn.notnull_col, 0) * 100 / t_col.col_count) AS notnull_pct
FROM   user_tables t
JOIN   (SELECT table_name, COUNT(*) AS col_count
        FROM   user_tab_columns GROUP BY table_name) t_col
    ON t.table_name = t_col.table_name
LEFT JOIN (SELECT table_name, COUNT(DISTINCT constraint_name) AS constraint_count
           FROM   user_constraints GROUP BY table_name) t_con
    ON t.table_name = t_con.table_name
LEFT JOIN (SELECT table_name, COUNT(*) AS notnull_col
           FROM   user_tab_columns WHERE nullable = 'N' GROUP BY table_name) nn
    ON t.table_name = nn.table_name
ORDER BY t.table_name;
