SELECT object_type,
       COUNT(*) AS cnt,
       MIN(created)        AS oldest,
       MAX(last_ddl_time)  AS latest_change
FROM   user_objects
GROUP BY object_type
ORDER BY cnt DESC;
