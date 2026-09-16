-- Step 1: 테이블 생성 및 데이터 복사
CREATE TABLE empl7_vip_new AS SELECT * FROM empl7 WHERE 1=0;
ALTER TABLE empl7_vip_new ADD dept_name_x VARCHAR2(30);

INSERT INTO empl7_vip_new (employee_id, first_name, last_name, email,
    phone_number, hire_date, job_id, salary, commission_pct,
    manager_id, department_id)
SELECT employee_id, first_name, last_name, email,
    phone_number, hire_date, job_id, salary, commission_pct,
    manager_id, department_id
FROM empl7 WHERE salary >= 15000;

-- Step 2: 부서명 채우기 (상관 UPDATE)
UPDATE empl7_vip_new v
SET    dept_name_x = (
    SELECT department_name
    FROM   departments d
    WHERE  d.department_id = v.department_id
);

-- Step 3: 직무 이력 없는 직원 삭제
DELETE FROM empl7_vip_new v
WHERE NOT EXISTS (
    SELECT NULL
    FROM   empl7_history eh
    WHERE  eh.employee_id = v.employee_id
);

-- Step 4: 최종 출력 후 COMMIT
SELECT employee_id, last_name, salary, dept_name_x
FROM   empl7_vip_new
ORDER BY salary DESC;

COMMIT;
