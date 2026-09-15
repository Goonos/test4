select department_id, count(employee_id)
from employees
group by department_id
order by department_id
/
