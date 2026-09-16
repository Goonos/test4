SELECT t.table_name,
       t.status,
       COUNT(c.column_name) AS col_count
FROM   user_tables      t
JOIN   user_tab_columns c ON t.table_name = c.table_name
GROUP BY t.table_name, t.status
ORDER BY col_count DESC;
