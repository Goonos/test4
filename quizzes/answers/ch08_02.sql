select last_name,job_id,salary
from employees
where job_id = (select job_id from employees where last_name = 'Abel')
AND last_name NOT in ('Abel')
/
