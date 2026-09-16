ALTER TABLE emp2 RENAME COLUMN phone_number TO phone;

DESCRIBE emp2;
-- 복원
ALTER TABLE emp2 RENAME COLUMN phone TO phone_number;
