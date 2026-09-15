select last_name, salary
from employees
where salary > (select AVG(salary) from employees)
order by salary DESC
/
