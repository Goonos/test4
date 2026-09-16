SELECT table_name, temporary, duration
FROM   user_tables
WHERE  temporary = 'Y'
ORDER BY table_name;
