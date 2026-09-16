DROP SYNONYM mo;
DROP INDEX my_ord_status_idx;
DROP INDEX my_ord_date_idx;
DROP TABLE my_orders PURGE;
DROP TABLE new_employees PURGE;
DROP SEQUENCE order_id_seq;
DROP SEQUENCE emp_id_seq;
DROP SEQUENCE dept_deptid_seq;

SELECT object_name, object_type FROM user_objects
WHERE  object_name IN (
    'MO','MY_ORDERS','NEW_EMPLOYEES',
    'ORDER_ID_SEQ','EMP_ID_SEQ','DEPT_DEPTID_SEQ',
    'MY_ORD_STATUS_IDX','MY_ORD_DATE_IDX'
);
