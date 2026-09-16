-- 1. 존재하지 않는 테이블 기반 뷰 생성 (FORCE)
CREATE FORCE VIEW ghost_vu AS
SELECT id, name FROM ghost_table;

-- 2. STATUS 확인 (INVALID)
SELECT object_name, status FROM user_objects WHERE object_name = 'GHOST_VU';

-- 3. 기반 테이블 생성
CREATE TABLE ghost_table (id NUMBER, name VARCHAR2(50));

-- 4. STATUS 재확인 (자동 변경 여부 — Oracle 버전에 따라 다름)
SELECT object_name, status FROM user_objects WHERE object_name = 'GHOST_VU';

ALTER VIEW ghost_vu COMPILE;
SELECT object_name, status FROM user_objects WHERE object_name = 'GHOST_VU';
