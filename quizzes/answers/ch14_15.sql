INSERT INTO emp_dept20_ck_vu
    (employee_id, last_name, email, hire_date, job_id, department_id)
VALUES (501, 'GoodUser', 'GOODUSER', SYSDATE, 'MK_REP', 20);

-- 뷰 조회 (department_id = 20인 행만 보임)
SELECT employee_id, last_name, department_id
FROM   emp_dept20_ck_vu
WHERE  employee_id = 501;

-- 기반 테이블 조회
SELECT employee_id, last_name, department_id
FROM   employees
WHERE  employee_id = 501;
