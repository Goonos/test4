CREATE TABLE emp_ext_loader
    (employee_id NUMBER(6),
     last_name   VARCHAR2(25),
     salary      NUMBER(8,2))
ORGANIZATION EXTERNAL
(
    TYPE ORACLE_LOADER
    DEFAULT DIRECTORY ext_data_dir
    ACCESS PARAMETERS
    (
        RECORDS DELIMITED BY NEWLINE
        FIELDS (
            employee_id POSITION (1:6)   CHAR,
            last_name   POSITION (8:32)  CHAR,
            salary      POSITION (34:41) CHAR
        )
    )
    LOCATION ('emp_data.csv')
)
REJECT LIMIT UNLIMITED;
