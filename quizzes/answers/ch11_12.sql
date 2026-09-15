CREATE TABLE setnull_child (
    child_id  NUMBER(5) PRIMARY KEY,
    parent_id NUMBER(5),
    CONSTRAINT fk_setnull FOREIGN KEY (parent_id)
        REFERENCES cascade_parent(parent_id)
        ON DELETE SET NULL
);

INSERT INTO setnull_child VALUES (201, 2)
INSERT INTO setnull_child VALUES (202, 2)
COMMIT

-- CASCADE와 다르게 SET NULL은 연결된 튜플이 NULL로 변한다.

/