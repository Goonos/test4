select employee_id, last_name, department_name, city
from employees e JOIN departments d ON e.department_id = d.department_id
JOIN locations l ON d.location_id = l.location_id
order by department_name, last_name
/
