-- 현재 트랜잭션만 DEFERRED로 변경
SET CONSTRAINTS dept2_imm_pk DEFERRED;

-- 중복 INSERT 성공 (DEFERRED 상태이므로)
INSERT INTO dept2 (department_id, department_name)
VALUES (10, 'Deferred Test');

-- COMMIT 시 오류
COMMIT;
