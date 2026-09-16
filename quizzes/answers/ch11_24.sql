CREATE TABLE top_earners_backup AS
SELECT employee_id, last_name, salary, department_id
FROM   employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS ONLY;

SELECT COUNT(*) FROM top_earners_backup;

SELECT * FROM top_earners_backup ORDER BY salary DESC;

SELECT e.employee_id, e.last_name, e.salary, t.salary AS backup_salary
FROM   employees e
JOIN   top_earners_backup t ON e.employee_id = t.employee_id
ORDER BY e.salary DESC;
