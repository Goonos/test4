SELECT last_name, salary, job_id
FROM   employees
WHERE  salary BETWEEN (SELECT lowest_sal
                       FROM   job_grades
                       WHERE  grade_level = 'E')
                  AND (SELECT highest_sal
                       FROM   job_grades
                       WHERE  grade_level = 'E')
ORDER BY salary DESC;
