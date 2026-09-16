SELECT table_name, column_name, data_length
FROM   user_tab_columns
WHERE  data_type = 'VARCHAR2'
ORDER BY data_length DESC
FETCH FIRST 5 ROWS ONLY;
