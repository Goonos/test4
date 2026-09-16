CREATE PRIVATE TEMPORARY TABLE ORA$PTT_sess_work
    (row_id   NUMBER,
     row_data VARCHAR2(200))
ON COMMIT PRESERVE DEFINITION;

INSERT INTO ORA$PTT_sess_work VALUES (1, 'First row');
COMMIT;

-- COMMIT 후에도 테이블 정의 유지 (데이터는 삭제됨)
SELECT * FROM ORA$PTT_sess_work;
