CREATE SYNONYM ghost_syn FOR nonexistent_table;
-- Synonym created. (참조 객체 존재 여부 확인 안 함)

SELECT * FROM ghost_syn;
-- ORA-00942: table or view does not exist
