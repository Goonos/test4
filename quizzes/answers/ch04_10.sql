select employee_id, last_name
from employees
where substr(last_name,-1,1) = 'n'
/
