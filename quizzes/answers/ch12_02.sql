SELECT object_type, COUNT(*) AS object_count
FROM   user_objects
GROUP BY object_type
ORDER BY object_count DESC
/