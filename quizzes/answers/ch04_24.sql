select last_name, round(sysdate-hire_date,1) as day, round((sysdate-hire_date)/7,1) as week, round((sysdate-hire_date)/7/52,1) as year
from employees
where department_id = 90
/
