select city, department_name
from locations JOIN departments USING(location_id)
order by department_name
/
