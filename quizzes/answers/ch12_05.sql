SELECT 'USER_OBJECTS' AS source, COUNT(*) AS cnt 
FROM user_objects
UNION ALL
SELECT 'ALL_OBJECTS' ,COUNT(*) 
FROM all_objects;
-- user 은 내가 소유한 정보만 보고
-- all 은 내가 볼 수 있는 권한을 가지고 있는 정보들을 가져옴

/