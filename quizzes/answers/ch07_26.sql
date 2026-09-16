SELECT   d.department_name, j.grade_level, COUNT(*) AS emp_count
FROM     employees e
JOIN     departments d  ON (e.department_id = d.department_id)
JOIN     job_grades j   ON (e.salary BETWEEN j.lowest_sal AND j.highest_sal)
GROUP BY d.department_name, j.grade_level
ORDER BY d.department_name, j.grade_level;
