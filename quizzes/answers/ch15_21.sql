CREATE GLOBAL TEMPORARY TABLE tmp_session_log
    (log_time TIMESTAMP DEFAULT SYSTIMESTAMP,
     log_msg  VARCHAR2(200))
ON COMMIT PRESERVE ROWS;

INSERT INTO tmp_session_log (log_msg) VALUES ('Start process');
COMMIT;
INSERT INTO tmp_session_log (log_msg) VALUES ('Step 1 done');
COMMIT;
