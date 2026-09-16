-- FK 비활성화 상태에서 무효 FK 값 삽입
INSERT INTO emp2 (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (500, 'TestEmp', 'TESTEMP', SYSDATE, 'IT_PROG', 9999);

SELECT employee_id, department_id FROM emp2 WHERE employee_id = 500;
