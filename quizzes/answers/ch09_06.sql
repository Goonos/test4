select employee_id, job_id, department_id
from employees
UNION
select employee_id, job_id, department_id
from job_history
order by employee_id
/
