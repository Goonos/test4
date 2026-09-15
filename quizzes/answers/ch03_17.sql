select last_name, department_id, salary
from employees
where department_id = 50
AND salary >= 3500
AND last_name LIKE 'S%'
order by salary
/
