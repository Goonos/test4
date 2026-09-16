CREATE TABLE dept_salary_summary AS
SELECT d.department_id,
       d.department_name,
       COUNT(e.employee_id)  AS emp_count,
       MIN(e.salary)         AS min_salary,
       MAX(e.salary)         AS max_salary,
       ROUND(AVG(e.salary))  AS avg_salary,
       SUM(e.salary)         AS total_salary
FROM   departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name
ORDER BY d.department_id;
