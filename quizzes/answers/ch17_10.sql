-- A: WITH CHECK OPTION 없음 → 삽입 성공
INSERT INTO (SELECT location_id, city, country_id FROM loc7 WHERE country_id = 'UK')
VALUES (8001, 'Glasgow', 'UK');

-- B: WITH CHECK OPTION 있음 → 'UK' 조건 만족하므로 삽입 성공
INSERT INTO (SELECT location_id, city, country_id FROM loc7 WHERE country_id = 'UK' WITH CHECK OPTION)
VALUES (8002, 'Glasgow', 'UK');

-- 확인
SELECT * FROM loc7 WHERE location_id IN (8001, 8002);
