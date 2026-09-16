SELECT 'MGR' AS group_label, last_name, job_id, salary
FROM   employees
WHERE  job_id LIKE '%_MAN' OR job_id LIKE '%_MGR'
UNION ALL
SELECT 'EXEC', last_name, job_id, salary
FROM   employees
WHERE  job_id IN ('AD_PRES', 'AD_VP')
UNION ALL
SELECT 'PROF', last_name, job_id, salary
FROM   employees
WHERE  job_id IN ('IT_PROG', 'FI_ACCOUNT', 'HR_REP')
ORDER BY salary DESC;
