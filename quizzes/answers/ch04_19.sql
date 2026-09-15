select employee_id, last_name
from employees
where mod(employee_id,2) = 0
/
