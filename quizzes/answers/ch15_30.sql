-- 외부 테이블
DROP TABLE emp_ext_loader;
DROP TABLE emp_export_ext;

-- 임시 테이블
DROP TABLE tmp_order_staging;
DROP TABLE tmp_session_log;

-- 실습용 테이블 (오류 무시 옵션 없으므로 존재 여부 확인 후 삭제)
DROP TABLE emp2;
DROP TABLE dept2;
DROP TABLE t_parent;
DROP TABLE t_child;

-- DIRECTORY 삭제 (DBA 계정으로)
DROP DIRECTORY ext_data_dir;

-- 정리 확인
SELECT table_name FROM user_tables
WHERE  table_name IN ('EMP2','DEPT2','T_PARENT','T_CHILD',
                      'TMP_ORDER_STAGING','TMP_SESSION_LOG',
                      'EMP_EXT_LOADER','EMP_EXPORT_EXT');
