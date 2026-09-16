SELECT MIN(max_sal) AS min_of_max
FROM   (SELECT MAX(salary) AS max_sal
        FROM   employees
        GROUP BY department_id);
