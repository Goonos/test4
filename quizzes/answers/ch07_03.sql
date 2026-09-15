select last_name, department_name,city
from employees
JOIN departments USING (department_id)
JOIN locations USING (location_id)
order by city, last_name
/
