select last_name, job_id, salary,
case job_id
when 'IT_PROG' THEN salary*1.1
when 'ST_CLERK' THEN salary*1.15
when 'SA_REP' THEN salary*1.2
else salary 
END as sal
from employees
/
