select last_name, department_id,department_name
from employees JOIN departments USING(department_id)
where department_id in (50,80)
order by last_name
/
