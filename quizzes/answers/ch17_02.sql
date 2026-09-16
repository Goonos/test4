INSERT INTO (
    SELECT l.location_id, l.city, l.country_id
    FROM   loc7 l
    JOIN   countries c ON (l.country_id = c.country_id)
    JOIN   regions        USING (region_id)
    WHERE  region_name = 'Europe'
    WITH CHECK OPTION
)
VALUES (9999, 'Sydney', 'AU');
