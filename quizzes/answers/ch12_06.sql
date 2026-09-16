SELECT object_name, object_type, last_ddl_time
FROM   user_objects
ORDER BY last_ddl_time DESC
FETCH FIRST 5 ROWS ONLY;
