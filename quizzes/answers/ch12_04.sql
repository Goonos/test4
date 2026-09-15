SELECT object_name, object_type, status
FROM   user_objects
WHERE  status = 'INVALID'
-- INVALID 상태는 작동이 정상적이지 않은 상태이기 때문이다.
/