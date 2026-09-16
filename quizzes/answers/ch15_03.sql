-- 1. PK 추가
ALTER TABLE emp2
ADD CONSTRAINT emp2_pk PRIMARY KEY (employee_id);

-- 2. FK 추가 (ON DELETE SET NULL)
ALTER TABLE emp2
ADD CONSTRAINT emp2_dept_fk
    FOREIGN KEY (department_id)
    REFERENCES dept2(department_id)
    ON DELETE SET NULL;

-- 3. CHECK 추가
ALTER TABLE emp2
ADD CONSTRAINT emp2_sal_ck CHECK (salary > 0);

-- 확인
SELECT constraint_name, constraint_type, status, delete_rule
FROM   user_constraints
WHERE  table_name = 'EMP2'
ORDER BY constraint_name;
