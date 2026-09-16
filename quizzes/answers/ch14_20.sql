CREATE OR REPLACE VIEW emp_expr_vu AS
SELECT employee_id, last_name, salary * 12 annual_sal
FROM   employees;

INSERT INTO emp_expr_vu VALUES (600, 'Kim', 96000);
