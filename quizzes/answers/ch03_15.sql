select last_name, job_id
from employees
where job_id  not in ('IT_PROG','ST_CLERK','SA_REP')
/
