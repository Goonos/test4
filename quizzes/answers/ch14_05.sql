create or replace view emp_dept50_vu (emp_id,name, MONTHLY_SAL, start_date)
as select employee_id, first_name ||''||last_name, salary, hire_date
from employees
where department_id = 50
/
