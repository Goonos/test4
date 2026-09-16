SELECT   e.department_id, j.grade_level, COUNT(*) AS emp_count
FROM     employees e
JOIN     job_grades j
ON       e.salary BETWEEN j.lowest_sal AND j.highest_sal
WHERE    j.grade_level IN ('C', 'D')
GROUP BY e.department_id, j.grade_level
ORDER BY e.department_id, j.grade_level;
