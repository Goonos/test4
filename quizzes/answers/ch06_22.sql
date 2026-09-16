SELECT   department_id, manager_id, COUNT(*) AS emp_count
FROM     employees
WHERE    manager_id IS NOT NULL
GROUP BY department_id, manager_id
ORDER BY department_id, manager_id;
