ALTER TABLE dept80_copy
ADD (commission_pct NUMBER(4,2));

DESCRIBE dept80_copy;

ALTER TABLE dept80_copy
SET UNUSED (commission_pct);

DESCRIBE dept80_copy;

ALTER TABLE dept80_copy
DROP UNUSED COLUMNS;

DESCRIBE dept80_copy;
