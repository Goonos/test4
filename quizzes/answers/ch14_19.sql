CREATE OR REPLACE VIEW dept_sal_vu AS
SELECT department_id, MAX(salary) max_sal
FROM   employees GROUP BY department_id;

DELETE FROM dept_sal_vu WHERE department_id = 80;
