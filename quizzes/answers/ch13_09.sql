CREATE SYNONYM emp FOR employees;

-- SELECT
SELECT employee_id, last_name, salary
FROM   emp
WHERE  department_id = 80
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;

-- UPDATE 가능 여부 확인
UPDATE emp
SET    salary = salary * 1.01
WHERE  employee_id = 100;

SELECT salary FROM emp WHERE employee_id = 100;
