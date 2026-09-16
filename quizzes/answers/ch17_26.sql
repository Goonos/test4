DROP TABLE empl7 PURGE;
DROP TABLE dept7 PURGE;
DROP TABLE empl7_history PURGE;
DROP TABLE loc7 PURGE;
DROP TABLE sales_top_new PURGE;
DROP TABLE dept7_stats_new PURGE;
DROP TABLE empl7_archive_new PURGE;
DROP TABLE empl7_vip_new PURGE;

-- 정리 확인
SELECT table_name FROM user_tables
WHERE  table_name LIKE 'EMPL7%' OR table_name LIKE 'DEPT7%'
    OR table_name LIKE 'LOC7%' OR table_name LIKE 'SALES_TOP%';
