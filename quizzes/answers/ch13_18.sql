DROP INDEX emp_last_name_idx;
DROP INDEX emp_dept_job_idx;
DROP INDEX emp_upper_last_idx;

SELECT index_name FROM user_indexes
WHERE  index_name IN ('EMP_LAST_NAME_IDX','EMP_DEPT_JOB_IDX','EMP_UPPER_LAST_IDX');
