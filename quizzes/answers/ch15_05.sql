-- 삭제 전 확인
SELECT constraint_name FROM user_constraints WHERE table_name = 'EMP2';

-- 삭제
ALTER TABLE emp2 DROP CONSTRAINT emp2_sal_ck;

-- 삭제 후 확인
SELECT constraint_name FROM user_constraints WHERE table_name = 'EMP2';
