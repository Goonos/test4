ALTER TABLE dept2
ADD CONSTRAINT dept2_defer_pk PRIMARY KEY (department_id)
DEFERRABLE INITIALLY DEFERRED;

-- 중복 PK 삽입 (오류 없이 성공)
INSERT INTO dept2 (department_id, department_name)
VALUES (10, 'Dup Test');

-- COMMIT 시 오류
COMMIT;
