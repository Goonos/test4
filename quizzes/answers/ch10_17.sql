-- 삭제
DELETE FROM copy_emp;
-- 확인
SELECT COUNT(*) FROM copy_emp;  -- 0

-- 복원
ROLLBACK;
-- 재확인
SELECT COUNT(*) FROM copy_emp; 