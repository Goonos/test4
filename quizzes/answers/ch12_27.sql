SELECT table_name, column_name, data_type, nullable
FROM   user_tab_columns
WHERE  column_name LIKE '%DATE%'
ORDER BY table_name, column_name;
