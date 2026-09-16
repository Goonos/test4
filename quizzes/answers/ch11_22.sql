DROP TABLE empty_emp PURGE;

SELECT object_name, original_name
FROM   recyclebin
WHERE  original_name = 'EMPTY_EMP';
