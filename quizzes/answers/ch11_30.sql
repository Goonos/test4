DROP TABLE orders;
DROP TABLE cascade_child;
DROP TABLE setnull_child;

DROP TABLE customers;
DROP TABLE products;
DROP TABLE cascade_parent;
DROP TABLE my_employees;
DROP TABLE my_departments;
DROP TABLE dept80_copy;
DROP TABLE top_earners_backup;
DROP TABLE dept_salary_summary;
DROP TABLE projects;

SELECT table_name FROM user_tables
WHERE  table_name IN ('MY_DEPARTMENTS','MY_EMPLOYEES','DEPT80_COPY',
                      'PROJECTS','CUSTOMERS','PRODUCTS','ORDERS',
                      'CASCADE_PARENT','CASCADE_CHILD','SETNULL_CHILD',
                      'TOP_EARNERS_BACKUP','DEPT_SALARY_SUMMARY');
