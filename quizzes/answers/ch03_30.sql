select employee_id, last_name, department_id, job_id,salary
from employees
where department_id in(50,60,80)
AND salary >=5000
AND last_name between 'A' AND 'M'
order by department_id, last_name
/
