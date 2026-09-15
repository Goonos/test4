select employee_id, last_name, salary, manager_id
from employees
where manager_id in (100,101,201)
/
