select last_name, department_name
from employees JOIN DEPARTMENTS
using(department_id)
order by last_name
/
