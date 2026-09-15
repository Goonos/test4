select employee_id, last_name
from employees
where substr(lower(last_name),1,3) = 'kin'
/
