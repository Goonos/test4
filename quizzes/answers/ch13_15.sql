CREATE INDEX emp_dept_job_idx
ON employees (department_id, job_id);

SELECT employee_id, last_name, salary
FROM   employees
WHERE  department_id = 80
AND    job_id = 'SA_REP';

SELECT index_name, column_name, column_position
FROM   user_ind_columns
WHERE  index_name = 'EMP_DEPT_JOB_IDX';
