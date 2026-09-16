SELECT d.department_name, cnt.emp_count
FROM   departments d
JOIN   (
    SELECT department_id, COUNT(*) emp_count
    FROM   employees
    GROUP BY department_id
) cnt ON (d.department_id = cnt.department_id)
WHERE  cnt.emp_count >= 5
ORDER BY cnt.emp_count DESC;
