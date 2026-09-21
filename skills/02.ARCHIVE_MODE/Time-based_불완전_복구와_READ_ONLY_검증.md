```sql
**초기 세팅**
ALTER SESSION SET nls_date_format = 'YYYY-MM-DD HH24:MI:SS';
Session altered.

SELECT checkpoint_change# FROM v$database;

CHECKPOINT_CHANGE#
------------------
           4407747

CREATE TABLE hr.emp102 TABLESPACE users   AS SELECT employee_id, last_name, salary FROM hr.employees;
Table created.
COMMIT;

SELECT COUNT(*), MAX(salary) FROM hr.emp102;

  COUNT(*) MAX(SALARY)
---------- -----------
       108     58349.5

ALTER SYSTEM ARCHIVE LOG CURRENT;

INSERT INTO hr.insa_2025 VALUES (10, SYSDATE);
COMMIT;
SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS now FROM dual;

NOW
--------
17:20:56

ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

실습 10-1을 마친 상태에서 시간 기반(Time-based) 복구를 위해 세션의 날짜 형식을 지정합니다.
테스트용 테이블(hr.emp102)을 생성하여 데이터를 검증하고 아카이브를 발생시킵니다.
이후 다른 테이블(hr.insa_2025)에 10번 데이터를 입력, 커밋한 뒤 시간을 확인(17:20:56)하여 나중에 정상 업무 데이터가 유지되는지 검증할 기준점으로 삼고 다시 아카이브를 수행합니다.

**장애 유발 (논리적 오류 발생)**
[oracle@oel7v9 ~]$ sqlplus hr/hr

HR@orcl> UPDATE emp102 SET salary = 0;
107 rows updated.

HR@orcl> COMMIT;
Commit complete.

HR@orcl> SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS now FROM dual;

NOW
--------
17:46:49

[oracle@oel7v9 ~]$ sqlplus / as sysdba

SYS@orcl> SELECT COUNT(*), MAX(salary) FROM hr.emp102;

  COUNT(*) MAX(SALARY)
---------- -----------
       107           0

SYS@orcl> ALTER SYSTEM ARCHIVE LOG CURRENT;
SYS@orcl> INSERT INTO hr.insa_2025 VALUES (11, SYSDATE);
SYS@orcl> COMMIT;
SYS@orcl> ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

별도의 터미널(세션)에서 HR 사용자로 접속해 실수로 WHERE 조건절 없이 전체 데이터의 급여를 0으로 변경(대량 UPDATE)하고 커밋합니다. 사고 발생 시각(17:46:49)을 확인합니다.
관리자 세션에서 데이터가 잘못 변경되었음을 확인합니다.
이후 아카이브 로그를 생성하고, 추가로 11번 데이터를 삽입 후 커밋하여 사고 이후의 정상 업무 데이터가 향후 어떻게 손실되는지 확인하기 위한 환경을 구성합니다.

**장애 유발 (논리적 오류 발생)**
[oracle@oel7v9 ~]$ sqlplus hr/hr

HR@orcl> UPDATE emp102 SET salary = 0;
107 rows updated.

HR@orcl> COMMIT;
Commit complete.

HR@orcl> SELECT TO_CHAR(SYSDATE, 'HH24:MI:SS') AS now FROM dual;

NOW
--------
17:48:16

[oracle@oel7v9 ~]$ sqlplus / as sysdba

SYS@orcl> SELECT COUNT(*), MAX(salary) FROM hr.emp102;

  COUNT(*) MAX(SALARY)
---------- -----------
       107           0

SYS@orcl> ALTER SYSTEM ARCHIVE LOG CURRENT;
SYS@orcl> INSERT INTO hr.insa_2025 VALUES (11, SYSDATE);
SYS@orcl> COMMIT;
SYS@orcl> ALTER SYSTEM ARCHIVE LOG CURRENT;
System altered.

별도의 터미널(세션)에서 HR 사용자로 접속해 실수로 WHERE 조건절 없이 전체 데이터의 급여를 0으로 변경(대량 UPDATE)하고 커밋합니다. 사고 발생 시각(10:22:40)을 확인합니다.
관리자 세션에서 데이터가 잘못 변경되었음을 확인합니다.
이후 아카이브 로그를 생성하고, 추가로 11번 데이터를 삽입 후 커밋하여 사고 이후의 정상 업무 데이터가 향후 어떻게 손실되는지 확인하기 위한 환경을 구성합니다.

**진단**
SELECT employee_id, last_name, salary FROM hr.emp102
  WHERE  ROWNUM <= 3;

EMPLOYEE_ID LAST_NAME       SALARY
----------- ------------ ---------
        100 King                 0
        101 Kochhar              0
        102 De Haan              0

SELECT COUNT(*) FROM v$recover_file;

  COUNT(*)
----------
         0

SELECT COUNT(*) FROM hr.emp102 AS OF TIMESTAMP
    TO_TIMESTAMP('2025-05-12 10:20:00', 'YYYY-MM-DD HH24:MI:SS');
*
ERROR at line 1:
ORA-01555: snapshot too old: rollback segment number 3 with name
"_SYSSMU3_2421748942$" too small

SELECT flashback_on FROM v$database;

FLASHBACK_ON
------------------
NO

SELECT sequence#, first_change#, next_change#,
            TO_CHAR(first_time, 'HH24:MI:SS') AS first_time
  FROM  v$log_history ORDER BY sequence# DESC FETCH FIRST 18 ROWS ONLY;


 SEQUENCE# FIRST_CHANGE# NEXT_CHANGE# FIRST_TI
---------- ------------- ------------ --------
        18       4405141      4405185 15:20:55
        17       4405106      4405141 15:19:33
        16       4395842      4405106 13:18:07
        15       4387860      4395842 17:10:40
        14       4187857      4387860 17:04:40
        13       4174993      4187857 12:32:11
        12       4174989      4174993 12:32:08
        11       4170435      4174989 11:55:19
        10       4070411      4170435 11:48:14
         9       4070406      4070411 11:48:08
         8       4068102      4070406 11:34:04
         7       4048857      4068102 16:40:45
         6       4048853      4048857 16:40:42
         6       4413636      4413654 17:49:26
         5       4046848      4048853 16:09:43
         5       4413593      4413636 17:47:50
         4       4016154      4046848 19:45:52
         4       4413490      4413593 17:47:15



물리적인 파일 손상이 없으므로 v$recover_file에 대상이 없음을 확인합니다.
대안으로 Flashback Query를 시도하지만 UNDO 데이터가 덮어써져 불가능(ORA-01555)하고, Flashback Database도 활성화되어 있지 않아 사용할 수 없음을 파악합니다.
결국 10:22:40 사고 직전 시점(UNTIL TIME)으로 데이터베이스 전체를 되돌리는 Time-based 불완전 복구를 수행하기로 판정하고, 백업본과 시퀀스의 유효성을 점검한 뒤 만약을 대비해 현재 상태의 데이터파일을 추가 백업해 둡니다.

**복구 절차 (1차 시도 및 문제 파악)**
SHUTDOWN IMMEDIATE
STARTUP MOUNT
!cp -p /fra/backup/cold/20260910_161639/ *.dbf /u02/oradata/orcl/

RECOVER DATABASE UNTIL TIME '2026-09-10 17:20:56';
Media recovery complete.

ALTER DATABASE OPEN READ ONLY;
Database altered.

SELECT COUNT(*), MAX(salary) FROM hr.emp102;

  COUNT(*) MAX(SALARY)
---------- -----------
       108           0


SELECT id, TO_CHAR(order_date, 'HH24:MI:SS') AS t FROM hr.insa_2025 ORDER BY id;

        ID T
---------- --------
         1 15:19:28
         2 15:20:50
        10 17:20:51
        11 17:47:22
        11 17:49:31


SELECT TO_CHAR(SCN_TO_TIMESTAMP(4407747), 'HH24:MI:SS') AS now FROM  v$database;


NOW
--------
16:16:46

모든 데이터파일을 백업본으로 덮어쓰고, 안전을 위해 사고 시각보다 이른 10:10:00을 목표 시점으로 불완전 복구를 1차 수행합니다.
READ ONLY로 오픈해 검증해 보니 잘못된 UPDATE 결과는 사라졌으나, 10:14:22에 입력했던 정상 데이터(10번)까지 잃어버렸음을 확인합니다. 
복구를 너무 이른 시점에서 멈췄기 때문임을 파악하고, RESETLOGS로 열기 전이므로 파일 덮어쓰기 없이 이어서 복구할 수 있음을 확인합니다.

**복구 절차 (2차 시도 및 성공)**
SHUTDOWN IMMEDIATE
STARTUP MOUNT

RECOVER DATABASE UNTIL TIME '2025-09-10 16:16:46';
Media recovery complete.

ALTER DATABASE OPEN READ ONLY;

SELECT COUNT(*), MAX(salary) FROM hr.emp102;


  COUNT(*) MAX(SALARY)
---------- -----------
       108           0


SELECT id, TO_CHAR(order_date, 'HH24:MI:SS') AS t FROM hr.insa_2025 ORDER BY id;


        ID T
---------- --------
         1 15:19:28
         2 15:20:50
        10 17:20:51
        11 17:47:22
        11 17:49:31

SHUTDOWN IMMEDIATE
STARTUP MOUNT
ALTER DATABASE OPEN RESETLOGS;

Database altered.

데이터베이스를 MOUNT 상태로 내린 후 백업 파일 복원 없이 바로 RECOVER 명령을 내려, 사고 직전 시각인 10:22:30까지 이어서 복구를 수행합니다.
READ ONLY 오픈 후 재검증해 보니 논리적 오류는 해결되고(급여 24000) 정상 데이터(10번 행)는 복원된 완벽한 시점임을 확인합니다.
확인이 끝난 데이터베이스를 다시 MOUNT 상태로 내려 RESETLOGS 옵션으로 오픈합니다.
```