SELECT index_name, uniqueness, index_type
FROM   user_indexes
WHERE  table_name = 'EMPLOYEES'
ORDER BY index_name;
