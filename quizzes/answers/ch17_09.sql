UPDATE (
    SELECT l.location_id, l.city, l.country_id
    FROM   loc7 l
    JOIN   countries c ON (l.country_id = c.country_id)
    JOIN   regions        USING (region_id)
    WHERE  region_name = 'Europe'
    WITH CHECK OPTION
)
SET    city = 'London Updated'
WHERE  city = 'London';

-- 확인
SELECT location_id, city, country_id
FROM   loc7
WHERE  city = 'London Updated';
