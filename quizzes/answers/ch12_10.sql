SELECT table_name, COUNT(*) AS col_count
FROM   user_tab_columns
GROUP BY table_name
ORDER BY col_count DESC;
