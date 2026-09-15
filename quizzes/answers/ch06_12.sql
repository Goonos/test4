select department_id, MIN(hire_date), MAX(hire_date)
from employees
group by department_id
order by department_id
/
