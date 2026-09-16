DROP VIEW emp_dept50_vu;
DROP VIEW emp_annual_sal_vu;
DROP VIEW emp_dept_vu;
DROP VIEW dept_sal_stats_vu;
DROP VIEW job_avg_sal_vu;
DROP VIEW emp_dept20_ck_vu;
DROP VIEW emp_dept10_ro_vu;
DROP VIEW emp_dept80_vu;
DROP VIEW dept_sal_vu;
DROP VIEW emp_expr_vu;
DROP VIEW emp_simple_vu;
DROP VIEW distinct_dept_vu;
DROP VIEW top10_emp_vu;
DROP VIEW emp_dept_join_vu;
DROP VIEW high_sal_vu;
DROP VIEW dept80_high_sal_vu;
DROP VIEW emp_summary_vu;

-- 정리 확인
SELECT view_name FROM user_views
WHERE  view_name LIKE 'EMP%'
    OR view_name LIKE 'DEPT%'
    OR view_name LIKE 'JOB%'
    OR view_name LIKE 'DISTINCT%'
    OR view_name LIKE 'TOP%'
ORDER BY view_name;
