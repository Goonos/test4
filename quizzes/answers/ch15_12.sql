-- 현재 제약 이름 확인
SELECT constraint_name FROM user_constraints
WHERE  table_name = 'DEPT2' AND constraint_type = 'P';

-- 이름 변경 (현재 이름이 SYS_Cxxxxxxxx인 경우)
ALTER TABLE dept2 RENAME CONSTRAINT dept2_pk TO dept2_id_pk;

-- 변경 후 확인
SELECT constraint_name FROM user_constraints
WHERE  table_name = 'DEPT2' AND constraint_type = 'P';
