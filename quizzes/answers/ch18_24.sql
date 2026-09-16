-- DBA 계정으로 실행
SELECT 'DIRECT' AS grant_type, privilege
FROM   dba_sys_privs
WHERE  grantee = 'TEST_USER1'
UNION ALL
SELECT 'VIA ROLE: ' || rsp.role, rsp.privilege
FROM   dba_role_privs rp
JOIN   role_sys_privs rsp ON (rp.granted_role = rsp.role)
WHERE  rp.grantee = 'TEST_USER1'
ORDER BY 1, 2;
