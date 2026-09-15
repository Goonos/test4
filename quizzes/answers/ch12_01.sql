desc dictionary

select table_name
from dictionary
where table_name LIKE '%TABLE%'
order by table_name
/