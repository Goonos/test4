SELECT 'USER_TAB_COMMENTS' AS view_name, COUNT(*) AS cnt
FROM   user_tab_comments
UNION ALL
SELECT 'ALL_TAB_COMMENTS', COUNT(*)
FROM   all_tab_comments;
