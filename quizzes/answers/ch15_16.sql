-- dept2_defer_pk 삭제 후 IMMEDIATELY 제약 추가
ALTER TABLE dept2 DROP CONSTRAINT dept2_defer_pk;

ALTER TABLE dept2
ADD CONSTRAINT dept2_imm_pk PRIMARY KEY (department_id)
DEFERRABLE INITIALLY IMMEDIATE;

-- 중복 INSERT 시도 → INSERT 시점에 즉시 오류
INSERT INTO dept2 (department_id, department_name)
VALUES (10, 'Dup Test2');
