select last_name, hire_date, salary
from employees
where job_id = (select job_id from employees where last_name = 'Zlotkey')
AND last_name NOT in ('Zlotkey')
/
