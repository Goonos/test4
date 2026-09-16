UPDATE copy_emp
SET    salary = (SELECT AVG(salary) FROM copy_emp)
WHERE  salary < (SELECT AVG(salary) FROM copy_emp);
