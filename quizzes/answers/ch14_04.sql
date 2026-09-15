create view emp_annual_sal_vu
as select last_name, phone_number, salary*12 as annual_salary
from employees
/
