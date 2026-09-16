ALTER TABLE dept80_copy READ ONLY;

UPDATE dept80_copy SET salary = 9999 WHERE ROWNUM = 1;
-- ORA-12081: update operation not allowed on table "HR"."DEPT80_COPY"
오류 원인: READ ONLY 상태에서는 DML(INSERT/UPDATE/DELETE) 불가.

ALTER TABLE dept80_copy READ WRITE;

UPDATE dept80_copy SET salary = 9999 WHERE ROWNUM = 1;
