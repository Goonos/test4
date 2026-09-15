select employee_id, last_name, salary
from employees
where job_id = 'SA_REP'
UNION
select employee_id, last_name, salary
from employees
where job_id = 'IT_PROG'
order by salary desc
/
