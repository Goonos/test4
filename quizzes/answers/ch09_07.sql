select employee_id
from employees
INTERSECT
select employee_id
from job_history
/
