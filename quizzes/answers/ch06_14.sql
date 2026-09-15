select department_id, count(employee_id)
from employees
group by department_id
having count(employee_id) >= 5
order by count(employee_id) DESC
/
