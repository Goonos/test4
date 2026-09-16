CREATE OR REPLACE VIEW emp_simple_vu AS
SELECT employee_id, last_name, salary, department_id
FROM   employees WHERE department_id IN (10, 20, 30);

-- UPDATE 시도 (단순 뷰, 표현식 없음)
UPDATE emp_simple_vu SET salary = 7000 WHERE employee_id = 200;

-- DELETE 시도
DELETE FROM emp_simple_vu WHERE employee_id = 200;

-- INSERT 시도 (email, hire_date, job_id 등 필수 열 누락 → 오류)
INSERT INTO emp_simple_vu (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (601, 'Test', 'TEST', SYSDATE, 'AD_ASST', 10);
