INSERT INTO projects VALUES (1, 'Alpha Project', 1000000, 'ACTIVE', SYSDATE);
COMMIT;
SELECT * FROM projects;

DROP TABLE projects;

SELECT object_name, original_name, type
FROM   recyclebin
WHERE  original_name = 'PROJECTS';
-- BIN$xxxxx==$0  PROJECTS  TABLE

FLASHBACK TABLE projects TO BEFORE DROP;

SELECT * FROM projects;
