select last_name, department_id
from employees
where department_id = 20
UNION ALL
select last_name, department_id
from employees
where department_id = 30
UNION ALL
select last_name, department_id
from employees
where department_id = 40
order by 2
/
