SELECT column_name, data_type, data_length,
       data_precision, data_scale, nullable, data_default
FROM   user_tab_columns
WHERE  table_name = 'EMPLOYEES'
ORDER BY column_id;
