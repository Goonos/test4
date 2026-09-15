alter table dept80_copy
  2  modify (job_id VARCHAR2(5));
modify (job_id VARCHAR2(5))

--ERROR at line 2
--ORA-01441: cannot decrease column length because some value is too big
--이미 5글자보다 큰 값이 있어 변경이 안됨

/