DROP SYNONYM dept;
DROP SYNONYM emp;
DROP SYNONYM j;
DROP SYNONYM ghost_syn;

SELECT synonym_name FROM user_synonyms
WHERE  synonym_name IN ('DEPT','EMP','J','GHOST_SYN');
