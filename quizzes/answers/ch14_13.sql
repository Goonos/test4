CREATE OR REPLACE VIEW emp_dept20_ck_vu
AS SELECT *
   FROM   employees
   WHERE  department_id = 20
WITH CHECK OPTION CONSTRAINT empvu20_ck;
