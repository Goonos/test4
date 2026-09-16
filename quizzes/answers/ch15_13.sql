CREATE TABLE t_parent (pk_id NUMBER PRIMARY KEY, val VARCHAR2(50));
CREATE TABLE t_child  (fk_id NUMBER, val VARCHAR2(50),
                       CONSTRAINT tc_fk FOREIGN KEY(fk_id)
                       REFERENCES t_parent(pk_id));

-- 1. CASCADE CONSTRAINTS 없이 시도
ALTER TABLE t_parent DROP COLUMN pk_id;

-- 2. CASCADE CONSTRAINTS로 삭제
ALTER TABLE t_parent DROP COLUMN pk_id CASCADE CONSTRAINTS;

-- 3. t_child FK 확인
SELECT constraint_name FROM user_constraints WHERE table_name = 'T_CHILD';
