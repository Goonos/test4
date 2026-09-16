CREATE TABLE sales_top_new AS SELECT * FROM empl7 WHERE 1=0;

INSERT INTO sales_top_new
SELECT *
FROM   empl7
WHERE  department_id = 80
AND    salary >= 10000;
