SELECT table_name,
       COUNT(*) AS total_cols,
       SUM(CASE WHEN nullable = 'N' THEN 1 ELSE 0 END) AS notnull_cols,
       ROUND(SUM(CASE WHEN nullable = 'N' THEN 1 ELSE 0 END) / COUNT(*) * 100) AS notnull_pct
FROM   user_tab_columns
GROUP BY table_name
ORDER BY notnull_pct DESC;
