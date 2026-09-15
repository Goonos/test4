const PROJECT_QA_DATA = {
    "proj-01": [
        {
            question: "다음 MEMBER 테이블 인스턴스 차트를 기반으로 테이블을 생성하십시오. 적합한 데이터 유형을 선택하고 무결성 제약 조건을 추가해야 합니다.",
            code: `
create table MEMBER(
	member_id NUMBER(10),
	last_name VARCHAR2(25) CONSTRAINT MEMBER_last_name_nn NOT NULL,
	first_name VARCHAR2(25),
	Address VARCHAR2(100),
	CITY VARCHAR2(30),
	PHONE VARCHAR2(15),
	JOIN_DATE DATE DEFAULT SYSDATE CONSTRAINT member_join_date_nn NOT NULL,
	
	CONSTRAINT member_member_id_pk Primary KEY (member_id)
	)
;
            `
        },
        {
            question: "다음 TITLE 테이블 인스턴스 차트를 기반으로 테이블을 생성하십시오. 적합한 데이터 유형을 선택하고 무결성 제약 조건을 추가해야 합니다.",
            code: `
create table TITLE(
	TITLE_ID NUMBER(10),
	TITLE VARCHAR2(60) CONSTRAINT TITLE_title_nn NOT NULL,
	DESCRIPTION VARCHAR2(400) CONSTRAINT TITLE_description_nn NOT NULL,
	RATING VARCHAR2(4),
	CATEGORY VARCHAR2(20),
	RELEASE_DATE DATE,
	CONSTRAINT TITLE_ID_pk PRIMARY KEY(TITLE_ID),
	CONSTRAINT TITLE_rating_ck CHECK (RATING  in ('G','PG','R','NC17','NR')),
	CONSTRAINT TITLE_category_ck CHECK (CATEGORY in ('DRAMA','COMEDY','ACTION','CHILD','SCIFI','DOCUMENTARY'))
	);
            `
        },
        {
            question: "다음 TITLE_COPY 테이블 인스턴스 차트를 기반으로 테이블을 생성하십시오. 적합한 데이터 유형을 선택하고 무결성 제약 조건을 추가해야 합니다.",
            code: `
create table title_copy (
	COPY_ID NUMBER(10),
	TITLE_ID NUMBER(10),
	STATUS VARCHAR2(15) constraint title_copy_title_nn NOT NULL,
	CONSTRAINT PK_title_copy_copy_Id_title_id PRIMARY KEY(COPY_ID, TITLE_ID),
	CONSTRAINT title_copy_title_id_fk foreign key (TITLE_ID) references TITLE(TITLE_ID),
	CONSTRAINT title_copy_status_ck check (status in ('AVAILABLE','DESTROYED','RENTED','RESERVED'))
);
            `
        },
        {
            question: "다음 RENTAL 테이블 인스턴스 차트를 기반으로 테이블을 생성하십시오. 적합한 데이터 유형을 선택하고 무결성 제약 조건을 추가해야 합니다.",
            code: `
create table RENTAL (
	BOOK_DATE DATE DEFAULT SYSDATE,
	MEMBER_ID NUMBER(10),
	COPY_ID NUMBER(10),
	ACT_RET_DATE DATE,
	EXP_RET_DATE DATE DEFAULT SYSDATE+2,
	TITLE_ID NUMBER(10),
	CONSTRAINT PK_RENTAL PRIMARY KEY (BOOK_DATE, MEMBER_ID, COPY_ID, TITLE_ID),
	CONSTRAINT RENTAL_member_id_FK FOREIGN KEY (member_id) REFERENCES MEMBER (MEMBER_ID),
	CONSTRAINT RENTAL_copy_id_title_id_fk FOREIGN KEY (COPY_ID,TITLE_ID) REFERENCES TITLE_COPY(COPY_ID,TITLE_ID)
);
            `
        },
        {
            question: "다음 RESERVATION 테이블 인스턴스 차트를 기반으로 테이블을 생성하십시오. 적합한 데이터 유형을 선택하고 무결성 제약 조건을 추가해야 합니다.",
            code: `
create table reservation (
	RES_DATE DATE NOT NULL,
	MEMBER_ID NUMBER(10) NOT NULL,
	TITLE_ID NUMBER(10) NOT NULL,
	CONSTRAINT PK_reservation PRIMARY KEY (RES_DATE, MEMBER_ID, TITLE_ID),
	CONSTRAINT reservation_mem_fk Foreign KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID),
	CONSTRAINT reservation_tit_fk Foreign KEY (TITLE_ID) REFERENCES TITLE (TITLE_ID)
	)
	;
            `
        },
        {
            question: "MEMBER테이블 및 TITLE테이블의 각 행(row)을 고유하게 식별하는 시퀀스를 생성하십시오.  <br> MEMBER테이블의 회원 번호는 101부터 시작하고 값이 캐시되지 않도록 하십시오. 시퀀스 이름은 MEMBER_ID_SEQ로 지정하십시오.",
            code: `
CREATE SEQUENCE TITLE_ID_SEQ
INCREMENT BY 1
START WITH 92 
NOCACHE;
            `
        },
        {
            question: "MEMBER테이블 및 TITLE테이블의 각 행(row)을 고유하게 식별하는 시퀀스를 생성하십시오.  <br> TITLE테이블의 제목 번호는 92부터 시작하고 캐시되지 않도록 하십시오. 시퀀스이름은 TITLE_ID_SEQ로 지정하십시오.",
            code: `
CREATE SEQUENCE MEMBER_ID_SEQ
INCREMENT BY 1
START WITH 101
NOCACHE;
            `
        },
        
        {
            question: "TITLE테이블에 영화 제목을 추가하십시오. 영화 정보를 입력할 스크립트를작성하여 lab_4a.sql이라는 이름으로 저장하십시오. 시퀀스를 사용하여 각 제목을고유하게 식별하고 출시일을 DD-MON-YYYY형식으로 입력하십시오. ",
            code: `
INSERT INTO TITLE (TITLE_ID, TITLE, DESCRIPTION, RATING, CATEGORY, RELEASE_DATE)
VALUES (
    TITLE_ID_SEQ.NEXTVAL,
    '&p_title',
    '&p_description',
    '&p_rating',
    '&p_category',
    TO_DATE('&p_release_date', 'DD-MON-YYYY')
);
            `
        },

        
        {
            question: "MEMBER테이블에 다음 데이터를 추가하십시오. <br>시퀀스를 사용하여 회원 번호를 추가해야 합니다.",
            code: `
INSERT INTO MEMBER (MEMBER_ID, FIRST_NAME, LAST_NAME, ADDRESS, CITY, PHONE, JOIN_DATE)
VALUES (
    MEMBER_ID_SEQ.NEXTVAL, 
    '&p_first_name', 
    '&p_last_name', 
    '&p_address', 
    '&p_city', 
    '&p_phone', 
    TO_DATE('&p_join_date', 'DD-MON-YYYY')
);
            `
        },


        
        {
            question: "TITLE_COPY테이블에 다음 영화 복사본을 추가하십시오",
            code: `
INSERT INTO RENTAL (TITLE_ID, COPY_ID, MEMBER_ID, BOOK_DATE, EXP_RET_DATE, ACT_RET_DATE)
VALUES (94, 1, 103, SYSDATE - 3, SYSDATE - 1, SYSDATE - 2);


INSERT INTO RENTAL (TITLE_ID, COPY_ID, MEMBER_ID, BOOK_DATE, EXP_RET_DATE, ACT_RET_DATE)
VALUES (95, 2, 103, SYSDATE - 1, SYSDATE + 1, NULL);


INSERT INTO RENTAL (TITLE_ID, COPY_ID, MEMBER_ID, BOOK_DATE, EXP_RET_DATE, ACT_RET_DATE)
VALUES (97, 3, 107, SYSDATE - 2, SYSDATE, NULL);


INSERT INTO RENTAL (TITLE_ID, COPY_ID, MEMBER_ID, BOOK_DATE, EXP_RET_DATE, ACT_RET_DATE)
VALUES (99, 1, 108, SYSDATE - 4, SYSDATE - 2, SYSDATE - 2);

            `
        },
        {
            question: "RENTAL테이블에 다음 대여 항목을 추가하십시오.",
            code: `
CREATE SEQUENCE MEMBER_ID_SEQ START WITH 101 NOCACHE;
CREATE SEQUENCE TITLE_ID_SEQ START WITH 92 NOCACHE;
            `
        },
        {
            question: "영화제목, 각복사본의대여가능여부, 반환예정일(대여된경우)을표시하는 TITLE_AVAIL이라는이름의뷰를생성하고뷰의모든행(row)을질의한후결과를 제목별로정렬하십시오.",
            code: `
CREATE OR REPLACE VIEW TITLE_AVAIL AS
SELECT 
    t.TITLE,
    tc.COPY_ID,
    tc.STATUS,
    r.EXP_RET_DATE AS EXP_RET_D
FROM TITLE t
JOIN TITLE_COPY tc 
    ON t.TITLE_ID = tc.TITLE_ID
LEFT JOIN RENTAL r 
    ON tc.TITLE_ID = r.TITLE_ID 
   AND tc.COPY_ID = r.COPY_ID 
   AND r.ACT_RET_DATE IS NULL;
            `
        },
        {
            question: "비디오를 추가하세요. 이영화의제목은“Interstellar Wars”이고등급은PG이며 SCIFI(공상 과학영화)로분류됩니다.",
            code: `
INSERT INTO TITLE (TITLE_ID, TITLE, DESCRIPTION, RATING, CATEGORY, RELEASE_DATE) 
VALUES ( TITLE_ID_SEQ.NEXTVAL, 'Interstellar Wars', 
'Futuristic interstellar action movie. Can the rebels save the humans from the evil empire?',
'PG', 'SCIFI', TO_DATE('07-07-1977', 'DD-MM-YYYY') );
            `
        },
        {
            question: "추가한 비디오의 복사본을 2개 생성하세요.",
            code: `
INSERT INTO TITLE_COPY (COPY_ID, TITLE_ID, STATUS) 
VALUES (1, 100, 'AVAILABLE');

INSERT INTO TITLE_COPY (COPY_ID, TITLE_ID, STATUS) 
VALUES (2, 100, 'AVAILABLE');
            `
        },
        {
            question: "예약항목두개를입력하십시오. 하나는“Interstellar Wars”를빌리려는Carmen Velasquez에대한항목이고다른하나는“Soda Gang”을빌리려는Mark Quick-toSee에대한항목입니다.",
            code: `

INSERT INTO RESERVATION (RES_DATE, MEMBER_ID, TITLE_ID)
VALUES (SYSDATE, 103, 100);

INSERT INTO RESERVATION (RES_DATE, MEMBER_ID, TITLE_ID)
VALUES (SYSDATE, 109, 99);
            `
        },
        {
            question: "고객 Carmen Velasquez 가영화 “Interstellar Wars”의복사본 1을빌렸으므로영화 예약항목에서Carmen Velasquez를제거하고대여정보를기록하십시오. <br> 반환예정일에는 기본값을사용할수있도록하고, 작성한뷰를사용하여대여정보가기록되었는지 확인하십시오.",
            code: `
DELETE FROM RESERVATION WHERE MEMBER_ID = 103 AND TITLE_ID = 100;

INSERT INTO RENTAL (TITLE_ID, COPY_ID, MEMBER_ID, BOOK_DATE, ACT_RET_DATE) 
VALUES (100, 1, 103, SYSDATE, NULL);
            `
        },
        {
            question: "TITLE테이블에PRICE열을추가하여비디오구입가격을기록하십시오. <br> 열은 소수둘째자리까지포함하여총8자리로표시하십시오.",
            code: `
ALTER TABLE TITLE
ADD (PRICE NUMBER(8,2));
            `
        },
        {
            question: "다음목록에따라각비디오의가격을갱신하는UPDATE 문을포함하는 명령을실행하십시오. ",
            code: `
UPDATE TITLE 
SET PRICE = &p_price 
WHERE TITLE_ID = &p_title_id;
            `
        },
        {
            question: "이후에는 책을 추가할때 필수로 가격이포함되도록하십시오.",
            code: `
ALTER TABLE TITLE
MODIFY (PRICE NUMBER(8,2) CONSTRAINT TITLE_PRICE_NN NOT NULL);
            `
        },
        {
            question: "Customer History Report라는제목의보고서를작성하십시오. ",
            code: `
SELECT 
	m.first_name || ' ' || m.last_name AS MEMBER_NAME, 
	t.title AS TITLE, TO_CHAR(r.book_date, 'DD-MON-YY') AS BOOK_DATE, 
	ROUND(NVL(r.act_ret_date, SYSDATE) - r.book_date) AS DURATION 
	FROM RENTAL r JOIN MEMBER m ON r.member_id = m.member_id 
	JOIN TITLE t ON r.title_id = t.title_id 
	ORDER BY MEMBER_NAME, BOOK_DATE;
            `
        }        
    ]
};
