CREATE OR REPLACE VIEW distinct_dept_vu AS
SELECT DISTINCT department_id FROM employees;

DELETE FROM distinct_dept_vu WHERE department_id = 80;
