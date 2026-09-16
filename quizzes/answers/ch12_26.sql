SELECT table_name, column_id, data_type, nullable
FROM   user_tab_columns
WHERE  column_name = 'DEPARTMENT_ID'
ORDER BY table_name;
