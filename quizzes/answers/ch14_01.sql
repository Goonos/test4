create view dem_dept50_vu
as select employee_id, last_name, salary,hire_date
from employees
where department_id = 50
/
