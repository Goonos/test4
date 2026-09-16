SELECT object_type, COUNT(*) AS cnt
FROM   user_objects
WHERE  object_type IN ('SEQUENCE', 'SYNONYM', 'INDEX')
GROUP BY object_type
ORDER BY object_type;
