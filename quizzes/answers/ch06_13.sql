select department_id, MAX(salary)
from employees
where salary >=10000
group by department_id
order by department_id
/
