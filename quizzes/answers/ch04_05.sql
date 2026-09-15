select last_name,job_id
from employees
where lower(job_id) LIKE '%man%'
/
