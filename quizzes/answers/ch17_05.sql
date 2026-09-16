CREATE TABLE dept7_stats_new (
    department_id   NUMBER(4),
    department_name VARCHAR2(30),
    emp_count       NUMBER,
    avg_salary      NUMBER(10, 2)
);

INSERT INTO dept7_stats_new
SELECT d.department_id, d.department_name,
       COUNT(e.employee_id),
       ROUND(AVG(e.salary), 2)
FROM   dept7 d
LEFT JOIN empl7 e ON (d.department_id = e.department_id)
GROUP BY d.department_id, d.department_name;
