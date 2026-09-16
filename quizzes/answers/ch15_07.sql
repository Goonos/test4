-- PK, FK 재추가
ALTER TABLE dept2 ADD CONSTRAINT dept2_pk PRIMARY KEY (department_id);
ALTER TABLE emp2  ADD CONSTRAINT emp2_dept_fk
    FOREIGN KEY (department_id) REFERENCES dept2(department_id) ON DELETE SET NULL;

-- FK 비활성화
ALTER TABLE emp2 DISABLE CONSTRAINT emp2_dept_fk;

-- 상태 확인
SELECT constraint_name, status
FROM   user_constraints
WHERE  table_name = 'EMP2' AND constraint_name = 'EMP2_DEPT_FK';
