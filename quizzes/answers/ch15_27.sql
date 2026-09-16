CREATE TABLE emp_export_ext
    (employee_id, last_name, salary, department_id)
ORGANIZATION EXTERNAL
(
    TYPE ORACLE_DATAPUMP
    DEFAULT DIRECTORY ext_data_dir
    LOCATION ('emp_export.dmp')
)
AS SELECT employee_id, last_name, salary, department_id
   FROM   employees
   WHERE  department_id = 80;

SELECT * FROM emp_export_ext ORDER BY employee_id;
