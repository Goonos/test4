-- 1. 뷰 생성
CREATE OR REPLACE VIEW emp_dept80_vu
AS SELECT *
   FROM   employees
   WHERE  department_id = 80;

-- 2. department_id = 90으로 삽입 (WITH CHECK OPTION 없음)
INSERT INTO emp_dept80_vu
    (employee_id, last_name, email, hire_date, job_id, department_id, salary)
VALUES (502, 'Ghost', 'GHOST', SYSDATE, 'SA_REP', 90, 5000);
-- 1 row created.

-- 3. 뷰 재조회 → 보이지 않음 (WHERE department_id = 80 조건 불만족)
SELECT employee_id, last_name, department_id
FROM   emp_dept80_vu
WHERE  employee_id = 502;
-- no rows selected

-- 4. 기반 테이블에서 확인 → 존재함
SELECT employee_id, last_name, department_id
FROM   employees
WHERE  employee_id = 502;
