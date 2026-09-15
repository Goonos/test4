// data.js
// 포트폴리오에 들어갈 모든 데이터 정의

const DATA = {

    
    // 1. 트러블슈팅 데이터 (상세 보기 데이터 추가 버전)
    troubleshooting: [
        {
            id: "ts-01", 
            title: "특정 집계 쿼리 타임아웃 발생 및 인덱스 재구성을 통한 개선",
            context: "대용량 결제 테이블에서 특정 기간 조회 시 5초 이상 소요되며 가끔 시스템 타임아웃 발생.",
            result: "조회 응답 속도 96% 개선 (5.2초 -> 0.2초), CPU Peak 부하 안정화.",
            code: SQL_QUERIES.ts01,
            relatedArchId: "arch-03", // ⭐️ 연결 고리: 3번 백서(성능 튜닝 백서)와 연동됩니다.
            details: [
                {
                    subtitle: "🔍 문제 진단 및 원인 분석 과정 (Deep Dive)",
                    content: "오라클 AWR(Automatic Workload Repository) 보고서와 <code>EXPLAIN PLAN</code>을 통해 해당 쿼리가 <code>HASH JOIN</code> 및 <code>SORT MERGE JOIN</code>을 수행하는 과정에서 대규모 임시 세그먼트(Temp Segment)를 디스크에 쓰고 있는 것을 발견했습니다. 기존 인덱스는 컬럼의 카디널리티(선택도)를 고려하지 않고 <code>STATUS</code>가 선두 컬럼으로 잡혀 있어, 실제 범위 검색 조건인 <code>CREATED_AT</code>의 장점을 전혀 활용하지 못하고 Full Table Scan에 준하는 Cost가 발생하고 있었습니다."
                },
                {
                    subtitle: "🛠️ 튜닝 시나리오 및 검증 절차",
                    content: "1단계로 선두 컬럼을 범위 검색 조건인 <code>CREATED_AT</code>으로 변경한 복합 인덱스를 생성했습니다. 2단계로 오라클 옵티마이저가 올바른 인덱스를 강제 인지할 수 있도록 쿼리에 <code>INDEX</code> 힌트를 명시했습니다. 테스트 환경에서 1,500만 건의 더미 데이터를 적재한 후 스트레스 테스트를 수행한 결과, 블록 I/O(Logical Reads) 수치가 기존 대비 1/50 수준으로 급감하는 전 과정을 SQL Trace(tkprof)를 통해 정량적으로 검증 완료했습니다."
                }
            ]
        },
        {
            id: "ts-02", 
            title: "text",
            context: "text",
            result: "text",
            code: SQL_QUERIES.ts02,
            relatedArchId: "arch-01", // ⭐️ 예시: 1번 백서와 연결
            details: [
                { subtitle: "🔍 text", content: "text" },
                { subtitle: "🛠️ text", content: "text" }
            ]
        }, 
        {
            id: "ts-03", 
            title: "text",
            context: "text",
            result: "text",
            code: SQL_QUERIES.ts03,
            relatedArchId: "arch-02", // ⭐️ 예시: 2번 백서와 연결
            details: [
                { subtitle: "🔍 text", content: "text" },
                { subtitle: "🛠️ text", content: "text" }
            ]
        },
    ],

    // 2. 아키텍처 및 백서 데이터 (2x2 Zero Downtime 구조 - 시각화 버전)
    architecture: [
        {
            id: "arch-01",
            pillar: "STABILITY",
            icon: "fas fa-shield-alt",
            title: "엔터프라이즈 DB 표준 환경 구축",
            summary: "단순 설치를 넘어, Linux 커널 튜닝부터 ASM 스토리지 구성까지 최적의 베이스 라인을 설계한 아키텍처입니다.",
            tags: ["Oracle 19c", "Linux", "ASM"],
            content: `<div class="p-5 text-gray-300">STABILITY 관련 상세 백서 내용이 들어갈 자리입니다.</div>`
        },
        {
            id: "arch-02",
            pillar: "AVAILABILITY",
            icon: "fas fa-server",
            title: "Data Guard & RAC 고가용성 구성",
            summary: "장애 발생 시 자동으로 대기 서버가 역할을 승계(Failover)하여 다운타임을 최소화하는 무중단 아키텍처입니다.",
            tags: ["Data Guard", "RAC", "Failover"],
            content: `<div class="p-5 text-gray-300">AVAILABILITY 관련 상세 백서 내용이 들어갈 자리입니다.</div>`
        },
        {
            id: "arch-03",
            pillar: "RESILIENCE",
            icon: "fas fa-life-ring",
            title: "RMAN 무손실 백업 및 복구",
            summary: "디스크 손상 등 치명적 장애 상황을 가정한 제로 데이터 유실(Zero Data Loss) 복구 시나리오 파이프라인입니다.",
            tags: ["RMAN", "Backup", "Recovery"],
            content: `<div class="p-5 text-gray-300">RESILIENCE 관련 상세 백서 내용이 들어갈 자리입니다.</div>`
        },
        {
            id: "arch-04",
            pillar: "SCALABILITY",
            icon: "fas fa-project-diagram",
            title: "대용량 트랜잭션 분산 처리",
            summary: "수천만 건의 데이터를 병렬로 빠르게 처리하기 위한 하이엔드 인프라(Exadata 등) 활용 아키텍처입니다.",
            tags: ["Exadata", "Big Data", "Tuning"],
            content: `<div class="p-5 text-gray-300">SCALABILITY 관련 상세 백서 내용이 들어갈 자리입니다.</div>`
        }
    ],

    // 3. 외부 블로그 링크 데이터
   blogLogs: [
       {
            date: "2026-07-24",
            title: "23회차 - 오라클11g Temporary Tables,External Tables, MERGE,Version query,Time Zones",
            summary: "Temporary Tables와 External Tables의 기초 개념을 익히고, MERGE 문을 활용한 데이터 통합 처리법을 학습하였으며, Version query 및 Time Zone 설정의 기본을 다루며 오라클 11g의 고급 데이터 관리 기능 전반을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224356756040"
        },
       {
            date: "2026-07-23",
            title: "22회차 - 오라클11g ALTER Statement UNUSED, 제약조건 수정(추가, 삭제, 옵션추가, enable, disable 등), INDEX, FLASHBACK",
            summary: "ALTER 문을 활용한 컬럼 비활성화(SET UNUSED) 및 제약조건 수정(추가, 삭제, ENABLE/DISABLE) 기초를 학습하고, INDEX의 기본 동작 방식과 FLASHBACK을 통한 기초 데이터 복구 개념을 익히며 오라클 11g 데이터베이스 구조 변경 및 관리 전반을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224355660844"
        },
       {
            date: "2026-07-22",
            title: "21회차 - 오라클11g 이터 아키텍처 모델링 DB 스키마 실습",
            summary: "ERD 구조 해석 기반의 DB 스키마 구현부터 치환 변수(&)를 활용한 대화형 DML 작성, 뷰(View) 및 제약 조건(Constraints) 제어, 데이터 분석 보고서 작성까지 오라클 데이터베이스의 핵심 운용 프로세스를 종합적으로 실습했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224354614433"
        },
       {
            date: "2026-07-21",
            title: "20회차 - 오라클11g (Synonym for an Object, User Access, Creating a role, Object Privileges)",
            summary: "Synonym을 활용한 객체 별칭 생성과 사용자 계정(User) 관리 기본을 익히고, Role을 통한 권한 그룹화 및 객체 권한(Object Privileges) 부여의 기초를 학습하며 오라클 11g의 데이터베이스 보안 및 접근 제어 개념 구축을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224353371434"
        },
       {
            date: "2026-07-20",
            title: "19회차 - 오라클11g 제약조건,CASE CADE, SET NULL, VIEW, SEQUENCE, INDEX",
            summary: "오라클 11g의 CASCADE 및 SET NULL 등 제약조건의 기본 옵션을 다뤄보고, VIEW, SEQUENCE, INDEX의 기본 생성 및 활용법을 학습하며 데이터베이스 객체의 기초 개념과 관리 과정을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224352291983"
        },
       {
            date: "2026-07-16",
            title: "18회차 - 오라클 11g (DML, TCL, DDL, 제약조건, PK, FP)",
            summary: "오라클 11g의 DML을 활용한 데이터 제어 및 TCL을 통한 트랜잭션 관리를 진행하였으며, DDL로 테이블을 정의하고 기본키(PK)와 외래키(FK)를 포함한 핵심 제약조건을 직접 설정하며 정교한 데이터베이스 구조 구축 과정을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224347624957"
        },
       {
            date: "2026-07-15",
            title: "17회차 - 오라클11g SQL(JOIN,Subqueries,Multiple-Row Subqueries,Set Operators,DML)",
            summary: "다양한 테이블의 관계를 분석하여 조건별 JOIN을 마스터하고 단일 및 다중 행 서브쿼리(Multiple-Row Subqueries)를 활용해 복잡한 조건의 중첩 데이터 필터링을 구현하였으며, 집합 연산자(Set Operators)를 통한 데이터 결합 및 DML(INSERT)을 사용한 실시간 데이터 조작 및 트랜잭션 처리 과정을 경험했습니다",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224351782643"
        },
       {
            date: "2026-07-14",
            title: "16회차 - 오라클11g SQL NULL연산(NVL,NVL2)CASE,산술연산, Group by,Having, Join",
            summary: "오라클11g SQL의 NVL, NVL2 함수 및 CASE 문을 활용한 데이터의 조건별 NULL 처리와 산술 연산을 수행하였으며, GROUP BY와 HAVING 절 기반의 대용량 데이터 그룹화 및 조건 필터링, 그리고 여러 테이블을 유기적으로 연결하는 다중 JOIN 문을 직접 작성하며 관계형 데이터베이스 집계 및 다차원 데이터 정제 과정을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224346555056"
        },
       {
            date: "2026-07-13",
            title: "15회차 - 오라클11g SQL 함수,형변환,치환 변수&&",
            summary: "오라클11g 문자, 숫자, 날짜 처리를 위한 오라클 내장 함수를 숙달하고 데이터 타입의 명시적·묵시적 형변환을 적용해 보았으며, 이중 치환 변수(&&)를 활용한 동적 쿼리 작성 실습을 진행하며 복잡한 데이터 가공 및 재사용성 높은 SQL 튜닝 과정을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224345468524"
        },
       {
            date: "2026-07-10",
            title: "14회차 - 오라클11g SQL 실습(SELECT절, FROM절, WHERE절)",
            summary: "오라클11g SQL의 핵심인 SELECT, FROM, WHERE 절을 활용하여 데이터베이스 내 데이터를 조건별로 필터링하고 원하는 구조로 추출하는 쿼리 작성 실습을 진행하며, 정밀한 데이터 조회 및 관계형 데이터베이스(RDB) 조작법 전반을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224342753990"
        },
       {
            date: "2026-07-09",
            title: "13회차 - 오라클11g 접속 권한 공유, SQL*Plus 커맨드",
            summary: "SQL*Plus 툴을 활용한 데이터베이스 제어 명령어를 숙달하고, 사용자 계정 생성부터 데이터베이스 관리자(DBA) 권한을 포함한 시스템 및 객체 접근 권한(Grant/Revoke) 부여 프로세스를 직접 실행해 보았습니다.",
            tags: ["Oracle","Linux"],
            link: "https://blog.naver.com/10soong/224341668109"
        },
       {
            date: "2026-07-08",
            title: "12회차 - 오라클11g 설치, 파라미터 설정, network 연결, putty로 접속",
            summary: "Oracle 11g 데이터베이스 설치 및 인프라 구축 프로세스를 진행하며 커널 파라미터 최적화와 리스너(Listener) 및 tnsnames 설정을 통한 네트워크 연동을 완료하였고, Putty를 활용한 원격 CLI 접속 환경을 구축하여 데이터베이스 관리 전반을 경험했습니다.",
            tags: ["Oracle","Linux"],
            link: "https://blog.naver.com/10soong/224340612409"
        },
       {
            date: "2026-07-07",
            title: "11회차 - 리눅스 커맨드 및 구조, Vi 커맨드, 파일 디렉토리 수정 커맨드",
            summary: "리눅스 핵심 명령어를 활용한 시스템 제어와 Vi 에디터를 통한 환경 설정 파일 편집을 진행했으며, 디렉터리 구조 분석 및 파일 권한 수정을 통해 리눅스 파일 시스템 관리 전반을 경험했습니다.",
            tags: ["Linux"],
            link: "https://blog.naver.com/10soong/224339414144"
        },
       {
            date: "2026-07-06",
            title: "10회차 - 리눅스 VMware11, Oracle Enterprise Linux5.8 설치",
            summary: "VMware 11 기반의 Oracle Enterprise Linux 5.8 설치를 진행하며 가상화 환경 구축 및 OS 배치 과정을 경험했습니다.",
            tags: ["Linux"],
            link: "https://blog.naver.com/10soong/224338338262"
        },
       {
            date: "2026-07-03",
            title: "9회차 - 파이썬 클래스변수, 매직매서드, 상속, 오버라이딩",
            summary: "파이썬 여러 객체가 함께 쓰는 데이터를 관리하는 클래스 변수와 객체의 행동을 내 마음대로 설정하는 매직 메서드를 다뤄보았습니다. 또한, 기존 코드를 그대로 물려받아 다시 쓰는 상속과 부모 클래스의 기능을 내 입맛에 맞게 바꾸는 오버라이딩을 직접 구현해 보면서, 코드를 더 효율적으로 짜고 재사용하는 객체지향의 기본 원리를 경험했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224335237361"
        }, 
       {
            date: "2026-07-02",
            title: "8회차 - 파이썬 CSV와 클래스",
            summary: "파이썬으로 데이터를 파일에 저장하고 읽어오는 CSV 파일 입출력 기능과, 프로그램을 구조적으로 만들 수 있는 클래스 개념을 학습했습니다. 외부 데이터를 프로그램으로 가져와 다루는 방법부터, 코드의 재사용성을 높여주는 객체지향 프로그래밍의 기초까지 배우며 실무 프로그램 개발을 위한 데이터 처리와 설계의 기본 원리를 다뤘습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224334387816"
        }, 
       {
            date: "2026-07-01",
            title: "7회차 - 파이썬 파일입출력과 예외처리",
            summary: "파이썬의 외부 데이터 연동과 프로그램 안정성의 핵심인 파일 입출력 및 예외 처리를 학습하여, 텍스트 데이터의 영속적 저장부터 실행 중 발생할 수 있는 잠재적 오류의 체계적 제어까지, 실무형 프로그램 개발과 견고한 소프트웨어 설계의 토대가 되는 데이터 핸들링 및 예외 관리 메커니즘의 동작 원리와 활용법을 다뤘습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224333259736"
        }, 
       {
            date: "2026-06-30",
            title: "6회차 - 파이썬 람다와 Import",
            summary: "익명 함수(lambda)와 고차 함수(map, filter)를 활용해 복잡한 반복문 없이 데이터를 효율적으로 정제하는 기법을 배웠습니다. 이에 더해 import를 통한 모듈화 구조를 습득하면서, 복잡한 로직을 재사용 가능한 독립적 단위로 쪼개고 관리하는 개발의 효율성을 체감할 수 있었습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224332026333"
        }, 
       {
            date: "2026-06-29",
            title: "5회차 - 파이썬 함수선언",
            summary: "다양한 자료구조 내 데이터의 효율적인 순회 기법(for in)과 코드 축약형 제어문(리스트 내포)을 통해 파이썬 고유의 최적화된 데이터 처리 방식을 이해하고, 반복적인 로직을 재사용 가능한 단위로 구조화하는 함수 지향적 설계 능력을 배양했습니다",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224330851876"
        }, 
       {
            date: "2026-06-26",
            title: "4회차 - 파이썬 반복문",
            summary: "파이썬의 핵심 제어 흐름인 while문과 for문을 학습하여 조건 기반 반복부터 시퀀스 순회까지, 자동화와 알고리즘 구현의 토대가 되는 루프 구조의 동작 원리와 활용법을 다뤘습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224328241497"
        }, 
       {
            date: "2026-06-25",
            title: "3회차 - 파이썬 제어문",
            summary: "기초 자료구조에 대한 이해와 if-elif 제어문을 통한 논리적 흐름 설계를 바탕으로, 업무 자동화 스크립트의 뼈대가 되는 데이터 입출력 제어, 형변환, 연산자 메커니즘 및 심화 문자열 처리 기술을 체계적으로 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224327194820"
        },     
       {
            date: "2026-06-24",
            title: "2회차 - 파이썬 집합자료형",
            summary: "파이썬의 기초 서식과 문자열, 리스트, 튜플에 대한 이해를 바탕으로, 프로그래밍 프로토타이핑과 업무 자동화 스크립트의 뼈대가 되는 데이터 입출력 제어, 형변환(Type Casting), 연산자 메커니즘 및 심화 문자열 처리 기술을 체계적으로 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224326086514"
        },
        {
            date: "2026-06-23",
            title: "1회차 - 파이썬 기초",
            summary: "프로그래밍 프로토타이핑과 자동화 스크립트의 기본이 되는 데이터 입출력 제어, 형변환(Type Casting), 연산자 메커니즘 및 문자열 처리 기초를 정리했습니다.",
            tags: ["Python"],
            link: "https://blog.naver.com/10soong/224324868806"
        }
    ],
    album: [
        { id: "img-01", src: "image/1.jpg", title: "[취미활동]", comment: "25년 8월 홍대에서 일렉기타 포지션으로 공연" },
        { id: "img-02", src: "image/2.jpg", title: "[취미활동]", comment: "26년 2월 홍대에서 일렉기타 포지션으로 공연" },
        { id: "img-03", src: "image/3.jpg", title: "[취미활동]", comment: "26년 2월 공연후 단체사진" },
        { id: "img-04", src: "image/4.jpg", title: "[여가활동]", comment: "해외여행 : 몽골" },
        { id: "img-05", src: "image/5.jpg", title: "[여가활동]", comment: "전시회 : 아르떼뮤지엄" },
        { id: "img-06", src: "image/6.jpg", title: "[교내활동]", comment: "학생회 임원으로서 체육대회 기획 및 운영 마무리 후 단체사진" },
        { id: "img-07", src: "image/7.jpg", title: "[Learn & Run]", comment: "박찬권 저자의 오라클 SQL 파워업 출간 전 베타테스트 및 스터디 " },
        { id: "img-08", src: "image/8.jpg", title: "[Learn & Run]", comment: "지인들로 팀을 만들어 개발프로젝트 진행" },
        { id: "img-09", src: "image/9.jpg", title: "[Learn & Run]", comment: "스터디와 밸런스를 맞추며 에너지를 발산하는 풋살" }
    ],
    // 💡 새로 추가된 Skills (위키형 뷰어) 데이터
    skills: [
        // 💡 1. 새로 추가된 SQL 카테고리 (기존 퀴즈 데이터 연동)
        {
            title: "SQL",
            icon: "fas fa-database text-blue-400",
            children: [
                {
                    title: "PRACTICE & QUIZ",
                    icon: "fas fa-laptop-code text-gray-400",
                    files: [
                        { 
                            title: "CHAPTER 12: 뷰(View) 생성, 수정 & 복합 뷰 실습 문제 (30문항)", 
                            url: "./quizzes/ch14.md", 
                            isQuiz: true, prefix: "ch14", quizId: "quiz-ch14",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 11: 시퀀스, 동의어, 인덱스 생성 실습 문제 (30문항)", 
                            url: "./quizzes/ch13.md", 
                            isQuiz: true, prefix: "ch13", quizId: "quiz-ch13",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 10: 데이터 딕셔너리 뷰 실습 문제 (30문항)", 
                            url: "./quizzes/ch12.md", 
                            isQuiz: true, prefix: "ch12", quizId: "quiz-ch12",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 09: 데이터 정의 언어(DDL) 소개", 
                            url: "./quizzes/ch11.md", 
                            isQuiz: true, prefix: "ch11", quizId: "quiz-ch11",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 08: DML 문을 사용한 테이블 관리 실습 문제 (30문항)", 
                            url: "./quizzes/ch10.md", 
                            isQuiz: true, prefix: "ch10", quizId: "quiz-ch10",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 07: 집합 연산자 사용 실습 문제 (30문항)", 
                            url: "./quizzes/ch09.md", 
                            isQuiz: true, prefix: "ch09", quizId: "quiz-ch09",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 06: 서브쿼리를 활용한 쿼리 작성 실습 문제", 
                            url: "./quizzes/ch08.md", 
                            isQuiz: true, prefix: "ch08", quizId: "quiz-ch08",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 05: JOIN(다중 테이블 조회) 실습 문제 (30문항)", 
                            url: "./quizzes/ch07.md", 
                            isQuiz: true, prefix: "ch07", quizId: "quiz-ch07",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 04: 그룹 함수 실습 문제 (30문항)", 
                            url: "./quizzes/ch06.md", 
                            isQuiz: true, prefix: "ch06", quizId: "quiz-ch06",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 03: 변환 함수와 조건식 실습 문제 (30문항)", 
                            url: "./quizzes/ch05.md", 
                            isQuiz: true, prefix: "ch05", quizId: "quiz-ch05",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 02: 단일행 함수 실습 문제 (30문항)", 
                            url: "./quizzes/ch04.md", 
                            isQuiz: true, prefix: "ch04", quizId: "quiz-ch04",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "CHAPTER 01: 데이터 제한 및 정렬 실습 문제 (30문항)", 
                            url: "./quizzes/ch03.md", 
                            isQuiz: true, prefix: "ch03", quizId: "quiz-ch03",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        }
                    ]
                }
            ]
        },
        // 2. 기존 BACKUP & RECOVERY 카테고리
        {
            title: "BACKUP & RECOVERY",
            icon: "fas fa-database text-red-400",
            children: [
                {
                    title: "ARCHIVE MODE",
                    icon: "fas fa-archive text-yellow-400",
                    files: [
                        { 
                            title: "1. Hot Backup 구성 및 장애 복구", 
                            // 실제 깃허브 원시(raw) 파일 주소로 변경하세요.
                            url: "./skills/backup_recovery/archive/ARC_데이터파일을 새 위치로 복구 — RENAME FILE.md" 
                        },
                        { 
                            title: "2. Tablespace Point-in-Time Recovery", 
                            url: "https://raw.githubusercontent.com/Goonos/test3/main/skills/backup_recovery/archive/tspitr.md" 
                        }
                    ]
                },
                {
                    title: "NOARCHIVE MODE",
                    icon: "fas fa-box-open text-gray-400",
                    files: [
                        { 
                            title: "1. Cold Backup 스크립트 작성 및 복구", 
                            url: "https://raw.githubusercontent.com/Goonos/test3/main/skills/backup_recovery/noarchive/cold_backup.md" 
                        }
                    ]
                }
            ]
        },
        {
            title: "PERFORMANCE TUNING",
            icon: "fas fa-tachometer-alt text-green-400",
            children: [
                {
                    title: "INDEX TUNING",
                    icon: "fas fa-list-ol text-blue-400",
                    files: [
                        { title: "1. 인덱스 스캔 효율화 사례", url: "#" }
                    ]
                }
            ]
        }
    ],
    // 💡 4. 신규 오라클 워크숍 퀴즈 데이터 세트 구축
    quizzes: [
        {
            id: "quiz-ch14",
            chapter: "CHAPTER 12",
            title: "뷰(View) 생성, 수정 & 복합 뷰 & WITH CHECK OPTION & WITH READ ONLY 실습 문제 (30문항)",
            summary: "뷰 생성 & 조회",
            date: "2026-07-29",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch14.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch14" 
        },
        {
            id: "quiz-ch13",
            chapter: "CHAPTER 11",
            title: "시퀀스, 동의어, 인덱스 생성 실습 문제 (30문항)",
            summary: "시퀀스, 동의어, 인덱스",
            date: "2026-07-28",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch13.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch13" 
        },
        {
            id: "quiz-ch12",
            chapter: "CHAPTER 10",
            title: "데이터 딕셔너리 뷰 실습 문제 (30문항)",
            summary: "데이터 딕셔너리 뷰, 읽기 전용 메타데이터의 이해",
            date: "2026-07-27",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch12.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch12" 
        },
        {
            id: "quiz-ch11",
            chapter: "CHAPTER 09",
            title: "데이터 정의 언어(DDL) 소개",
            summary: "CREATE, 제약조건, 서브쿼리",
            date: "2026-07-24",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch11.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch11" 
        },
        {
            id: "quiz-ch10",
            chapter: "CHAPTER 08",
            title: "DML 문을 사용한 테이블 관리 실습 문제 (30문항)",
            summary: "INSERT, UPDATE, DELETE, TRUNCATE, 트랜잭션 제어(COMMIT/ROLLBACK/SAVEPOINT)",
            date: "2026-07-23",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch10.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch10" 
        },
        {
            id: "quiz-ch09",
            chapter: "CHAPTER 07",
            title: "집합 연산자 사용 실습 문제 (30문항)",
            summary: "UNION, UNION ALL, INTERSECT, MINUS, 열 일치, ORDER BY",
            date: "2026-07-22",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch09.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch09" 
        },
        {
            id: "quiz-ch08",
            chapter: "CHAPTER 06",
            title: "서브쿼리를 활용한 쿼리 작성 실습 문제",
            summary: "단일행 서브쿼리, 그룹 함수 서브쿼리, HAVING + 서브쿼리, 다중행(IN/ANY/ALL), 다중열, 인라인 뷰, NOT IN + NULL 처리",
            date: "2026-07-21",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch08.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch08" 
        },
        {
            id: "quiz-ch07",
            chapter: "CHAPTER 05",
            title: "JOIN(다중 테이블 조회) 실습 문제 (30문항)",
            summary: "Natural Join, USING 절, ON 절, Self-Join, Nonequijoin, LEFT/RIGHT/FULL OUTER JOIN, CROSS JOIN, 3방향 조인",
            date: "2026-07-20",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch07.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch07" 
        },
        {
            id: "quiz-ch06",
            chapter: "CHAPTER 04",
            title: "그룹 함수 실습 문제 (30문항)",
            summary: "산술연산(SUM,AVG), Group by, Having",
            date: "2026-07-16",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch06.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch06" 
        },
        {
            id: "quiz-ch05",
            chapter: "CHAPTER 03",
            title: "변환 함수와 조건식 실습 문제 (30문항)",
            summary: "형변환, NULL연산, CASE, DECODE",
            date: "2026-07-15",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch05.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch05" 
        },
        {
            id: "quiz-ch04",
            chapter: "CHAPTER 02",
            title: "단일행 함수 실습 문제 (30문항)",
            summary: "단일행 함수 문자, 중첩 함수, 숫자함수, 날짜산술",
            date: "2026-07-14",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch04.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch04" 
        },
        {
            id: "quiz-ch03",
            chapter: "CHAPTER 01",
            title: "데이터 제한 및 정렬 실습 문제 (30문항)",
            summary: "WHERE 절, 비교 연산자, BETWEEN/IN/LIKE/IS NULL, AND/OR/NOT, 연산자 우선순위, ORDER BY, FETCH FIRST, 대체 변수",
            date: "2026-07-13",
            tags: ["Oracle", "SQL"],
            guideHTML: `
                <strong>🛠️ 실습 환경</strong><br>
                - DB버전: Oracle Database 11g / 사용 스키마: HR<br>
                - SQL 문제들을 직접 풀어본 내용입니다.<br>
                - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
            `,
            mdRawUrl: "https://raw.githubusercontent.com/Goonos/test3/main/quizzes/ch03.md", 
            githubBaseUrl: "https://github.com/Goonos/test3/blob/main/quizzes/answers",
            prefix: "ch03" 
        }
    ],
    miniProjects: [
        {
            id: "proj-01",
            date: "2026-07-25",
            title: "비디오 대여점 DB 구축 모델링",
            summary: "요구사항 명세 및 ERD를 분석하여 물리적 스키마(DDL)를 설계/구축하고 비즈니스 로직을 구현한 프로젝트입니다.",
            tags: ["DB Modeling", "SQL", "DDL/DML"],
            
            // 🔥 깃허브 페이지(GitHub Pages) 절대 경로 주소 사용
            docUrl: "https://goonos.github.io/test3/docs/video_rental.pdf", 
            
            qaList: PROJECT_QA_DATA["proj-01"] 
        }
    ]
    
};

