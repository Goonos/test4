SELECT * FROM user_tab_privs_recd;

SELECT employee_id, last_name, salary
FROM   hr.employees
WHERE  ROWNUM <= 5;
