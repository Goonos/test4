select last_name, salary/1000+0.3 as test_sal, ceil(salary/1000+0.3) as ceil_sal, floor(salary/1000+0.3) as floor_sal
from employees
/
