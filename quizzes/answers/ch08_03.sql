select last_name, job_id, salary
from employees
where salary = (select MIN(salary) from employees)
/
