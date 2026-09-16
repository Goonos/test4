CREATE INDEX emp_dept_ix1 ON employees(department_id, salary);

ALTER INDEX emp_dept_ix1 INVISIBLE;

SELECT index_name, visibility, status
FROM   user_indexes WHERE index_name = 'EMP_DEPT_IX1';

CREATE INDEX emp_sal_dept_ix2 ON employees(salary, department_id);

SELECT i.index_name, i.visibility, c.column_name, c.column_position
FROM   user_indexes i
JOIN   user_ind_columns c ON i.index_name = c.index_name
WHERE  i.index_name IN ('EMP_DEPT_IX1','EMP_SAL_DEPT_IX2')
ORDER BY i.index_name, c.column_position;
