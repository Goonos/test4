SELECT location_id, department_name "Name", TO_CHAR(NULL) "City"
FROM   departments
UNION
SELECT location_id, TO_CHAR(NULL) "Name", city
FROM   locations
ORDER BY location_id;
