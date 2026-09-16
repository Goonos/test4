ALTER SEQUENCE dept_deptid_seq
    INCREMENT BY 20
    MAXVALUE 99999;
-- Sequence altered.

SELECT sequence_name, increment_by, max_value
FROM   user_sequences
WHERE  sequence_name = 'DEPT_DEPTID_SEQ';
-- DEPT_DEPTID_SEQ  20  99999

SELECT dept_deptid_seq.NEXTVAL FROM dual;