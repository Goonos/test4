select first_name, last_name, LENGTH(first_name) as f_len, LENGTH(last_name) as l_name,
NULLIF(LENGTH(first_name),LENGTH(last_name)) as result
from employees
/
