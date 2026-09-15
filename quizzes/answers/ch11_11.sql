
CREATE TABLE cascade_parent (
    parent_id   NUMBER(5) PRIMARY KEY,
    parent_name VARCHAR2(30)
);

CREATE TABLE cascade_child (
    child_id  NUMBER(5) PRIMARY KEY,
    parent_id NUMBER(5),
    CONSTRAINT fk_cascade FOREIGN KEY (parent_id)
        REFERENCES cascade_parent(parent_id)
        ON DELETE CASCADE
);

INSERT INTO cascade_parent VALUES (1, 'Alpha')
INSERT INTO cascade_parent VALUES (2, 'Beta')
INSERT INTO cascade_child VALUES (101, 1)
INSERT INTO cascade_child VALUES (102, 1)
INSERT INTO cascade_child VALUES (103, 2)
COMMIT

Delete from cascade_parent where parent_id = 1

-- cascade_child 테이블의 child_id 1,2번 둘다 삭제된다.
/