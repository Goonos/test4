SELECT e.last_name, c.country_name, j.grade_level, e.salary
FROM   employees e
JOIN   departments d  ON (e.department_id = d.department_id)
JOIN   locations l    ON (d.location_id = l.location_id)
JOIN   countries c    ON (l.country_id = c.country_id)
JOIN   job_grades j   ON (e.salary BETWEEN j.lowest_sal AND j.highest_sal)
ORDER BY c.country_name, j.grade_level, e.salary;
