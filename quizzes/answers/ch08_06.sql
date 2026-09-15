select last_name, job_id, salary
from employees
where job_id in (select DISTINCT job_id from employees where last_name  = 'Taylor')
AND salary >  ALL (select salary from employees where last_name = 'Taylor')
/
