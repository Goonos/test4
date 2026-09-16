SELECT last_name, salary
FROM   (SELECT last_name, salary
        FROM   employees
        ORDER BY salary DESC)
WHERE  ROWNUM <= 5;
