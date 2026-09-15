select employee_id, last_name, job_id,salary
from employees
where salary >10000 AND job_id LIKE '%MAN%'
/
