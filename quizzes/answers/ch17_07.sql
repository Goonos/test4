INSERT INTO (
    SELECT location_id, city, country_id
    FROM   loc7
    WHERE  country_id = 'US'
    WITH CHECK OPTION
)
VALUES (9200, 'Toronto', 'CA');
