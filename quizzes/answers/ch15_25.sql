-- DBA 권한 계정으로 실행
CREATE OR REPLACE DIRECTORY ext_data_dir
AS '/home/oracle/ext_data';

GRANT READ ON DIRECTORY ext_data_dir TO hr;
