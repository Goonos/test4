select manager_id, count(employee_id)
from employees
where manager_id IS NOT NULL
group by manager_id
order by count(employee_id) DESC
/
