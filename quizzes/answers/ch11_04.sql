create table projects(
	project_id 	NUMBER(5),
	project_name	VARCHAR2(50) CONSTRAINT proj_name_nn NOT NULL,
	budget		NUMBER(12,2),
	status		VARCHAR2(20),
	start_date	DATE DEFAULT SYSDATE,
	CONSTRAINT proj_pk PRIMARY KEY (project_id),
	CONSTRAINT proj_budget_ck CHECK (budget >=0),
	CONSTRAINT proj_status_Ck CHECK (status IN('PLANNING','ACTIVE','CLOSED'))
)
/
