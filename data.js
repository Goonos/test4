// data.js
// 포트폴리오에 들어갈 모든 데이터 정의

const DATA = {

    
    // 1. 트러블슈팅 데이터 (상세 보기 데이터 추가 버전)
    troubleshooting: [
         {
            id: "ts-01", 
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
            date: "2026-09-17",
            title: "57회차 - 오라클19C RMAN을 이용한 백업",
            summary: "오라클 19c 환경에서 RMAN(Recovery Manager)을 활용한 전체 백업(Full Backup)과 증분 백업(Incremental Backup) 및 아카이브 로그 백업을 수행하며, RMAN 명령어 기반의 표준 데이터베이스 백업 구축 과정을 경험했습니다.",
            tags: ["Oracle", "RMAN", "BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224415183640"
        },
        {
            date: "2026-09-16",
            title: "56회차 - 오라클19C 아카이브 없는 Hot & Cold Backup & Recovery",
            summary: "노아카이브(NOARCHIVELOG) 모드 환경에서 콜드 백업과 핫 백업의 수행 조건 및 한계점을 확인하고, 백업본 기반의 전체 복원·복구 절차를 실습하며 비아카이브 환경의 장애 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224415179647"
        },
        {
            date: "2026-09-15",
            title: "55회차 - 오라클19c 백업&리커버리 DF,CF,RF 복합손상 및 복구",
            summary: "오라클 19c 환경에서 데이터 파일(DF), 컨트롤 파일(CF), 리두 로그 파일(RF)이 동시에 손실·손상되는 복합 장애 시나리오를 가정하고, 백업본과 백업 컨트롤 파일을 활용한 복원(Restore) 및 SCN 기반 불완전 복구, RESETLOGS 재생성을 거쳐 데이터베이스를 정상 오픈하는 최고 난도의 복합 장애 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224412762511"
        },
       {
            date: "2026-09-14",
            title: "54회차 - 오라클19c 백업&리커버리 불완전 복구",
            summary: "오라클 19c 환경에서 사용자의 논리적 오류나 물리적 로그 손실 상황을 대비하여 시간(Time), SCN, 또는 시퀀스(Sequence)를 기준으로 특정 시점까지만 데이터를 되돌리는 불완전 복구(Incomplete Recovery) 절차를 실습하고, RESETLOGS를 통한 신규 인카네이션 오픈 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224411550298"
        },
       {
            date: "2026-09-11",
            title: "53회차 - 오라클19c  SCN기반 백업&리커버리, rman 백업",
            summary: "오라클 19c 환경에서 SCN(System Change Number)을 추적하여 특정 시점으로 정밀 복구하는 불완전 복구 기법을 실습하고, RMAN(Recovery Manager)을 활용한 전체 백업 및 증분 백업(Incremental Backup) 기본 구성을 진행하며 RMAN 기반 데이터 보호 및 복구 자동화 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224408332743"
        },
       {
            date: "2026-09-10",
            title: "52회차 - 오라클19c 아카이브모드의 아카이브 파일 손상의 리커버리",
            summary: "오라클 19c 아카이브 모드 환경에서 복구에 필수적인 아카이브 로그 파일이 손실·손상된 비정상 시나리오를 가정하고, 남아 있는 로그 시퀀스 기반의 불완전 복구(Cancel-based / Until SCN Recovery)와 RESETLOGS 오픈 절차를 실습하며 데이터 유실 최소화 장애 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224407453940"
        },
       {
            date: "2026-09-09",
            title: "51회차 - 오라클19c 아카이브모드 핫백업&리커버리, 운영 중 UNDO 손상과 테이블스페이스 전환",
            summary: "오라클 19c 아카이브 모드 환경에서 운영 중 핫 백업(Hot Backup) 및 복구(Recovery) 절차를 실습하고, 실시간 운영 중 발생한 UNDO 테이블스페이스 손상 시 신규 UNDO 생성 및 파라미터 전환을 통한 무중단 복구 기법을 다뤄보며 고급 장애 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224406262382"
        },
       {
            date: "2026-09-08",
            title: "50회차 - 오라클19c 아카이브모드 백업&리커버리",
            summary: "오라클 19c 환경에서 아카이브(ARCHIVELOG) 모드 기반의 백업 운용 방식을 다뤄보고, 아카이브 로그와 리두 로그를 연계한 완전 복구(Complete Recovery) 및 시점 지정 불완전 복구(Incomplete Recovery) 실습을 진행하며 무손실 데이터 보호와 유연한 장애 복구 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224405661258"
        },
       {
            date: "2026-09-07",
            title: "49회차 - 오라클19c 노아카이브모드 백업&리커버리",
            summary: "오라클 19c 환경에서 노아카이브(NOARCHIVELOG) 모드 기반의 백업 전략과 복구 한계점을 파악하고, 전체 일관성 백업본을 활용한 전체 복구 실습을 진행하며 비아카이브 환경에서의 데이터 복구 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224403925763"
        },
       {
            date: "2026-09-04",
            title: "48회차 - read only ,UNDO, tablespace 손상 디스크 전체 손상, redo가 빠진 백업본, 컨트롤파일 전체 손상의 복구",
            summary: "Read Only 및 UNDO 테이블스페이스 손상, 디스크 전체 손상, 리두 로그가 누락된 백업본 기반 복구, 컨트롤 파일 전체 유실 등 다양한 극한 장애 시나리오별 복구(Recovery) 절차를 실습하며 데이터베이스 장애 복구 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224401100146"
        },
       {
            date: "2026-09-03",
            title: "47회차 - 오라클19C 백업파일 없는 T/S 리커버리, system sysaux undo tablespace의 데이터파일 삭제 후 복구",
            summary: "오라클 19c 환경에서 백업본이 없는 테이블스페이스의 복구 기법을 다뤄보고, SYSTEM, SYSAUX, UNDO 등 핵심 테이블스페이스의 데이터 파일 손실 상황을 가정한 복구(Recovery) 실습을 진행하며 고난도 장애 대응 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224399977546"
        },
       {
            date: "2026-09-02",
            title: "46회차 - 오라클19C hot backup, 데이터파일 백업리커버리, 아카이브 모드 유무",
            summary: "오라클 19c 환경에서 아카이브 모드(ARCHIVELOG) 유무에 따른 백업 차이를 파악하고, 운영 중 핫 백업(Hot Backup) 수행 및 손상된 데이터 파일(Datafile)에 대한 기초 복구(Recovery) 실습을 진행하며 가용성을 보장하는 데이터 보호 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224399940930"
        },
       {
            date: "2026-09-01",
            title: "45회차 - backup&recovery 이론 및 cold backup",
            summary: "백업 및 복구(Backup & Recovery)의 핵심 이론을 이해하고, DB 종료 상태에서 데이터 파일·컨트롤 파일·리두 로그 파일을 물리적으로 복제하는 콜드 백업(Cold Backup) 수행 절차를 실습하며 데이터베이스 보호의 기본 체계를 구축하는 과정을 경험했습니다.",
            tags: ["Oracle","BACKUP & RECOVERY"],
            link: "https://blog.naver.com/10soong/224397626814"
        },
       {
            date: "2026-08-26",
            title: "44회차 - 오라클19c 예외, 프로시저",
            summary: "오라클 19c 환경에서 예외 처리(Exception Handling)를 통한 런타임 오류 제어 기법을 익히고, 저장 프로시저(Stored Procedure)의 선언 및 매개변수 활용법을 실습하며 모듈화된 비즈니스 로직 구현 과정을 경험했습니다.",
            tags: ["Oracle","SQL","PL/SQL"],
            link: "https://blog.naver.com/10soong/224391169486"
        },
       {
            date: "2026-08-25",
            title: "43회차 - 오라클19c PL/SQL LOOP,WHILE LOOP, FOR LOOP CONTINUE WHEN, 커서",
            summary: "오라클 19c 환경에서 PL/SQL의 기본 반복문(LOOP, WHILE LOOP, FOR LOOP)과 제어문(CONTINUE WHEN)을 다뤄보고, 커서(Cursor)를 선언하여 복수 행 데이터를 순회·처리하는 기초 프로그래밍 과정을 경험했습니다.",
            tags: ["Oracle","SQL","PL/SQL"],
            link: "https://blog.naver.com/10soong/224389939613"
        },
       {
            date: "2026-08-24",
            title: "42회차 - 오라클19c cold hot backup, DB복제, rman으로 DB복제",
            summary: "오라클 19c 환경에서 콜드 백업(Cold Backup)과 핫 백업(Hot Backup)의 기초 수행 방식을 익히고, RMAN을 활용한 데이터베이스 복제(Duplicate DB) 작업을 실습하며 데이터 보호 및 DB 복제 운용 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224388772908"
        },
       {
            date: "2026-08-20",
            title: "41회차 - 오라클19c Data Pump(expdp/impdp), SQL*Loader(sqlldr),트랜스포터블테이블스페이스(TTS)",
            summary: "Data Pump(expdp/impdp)와 SQL*Loader(sqlldr)를 이용한 대용량 데이터 추출 및 적재 기법을 익히고, 트랜스포터블 테이블스페이스(TTS)의 기초 원리를 학습하며 오라클 19c의 데이터 이동 및 마이그레이션 관리 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224384766862"
        },
       {
            date: "2026-08-19",
            title: "40회차 - 오라클 19C 프로파일, AUDIT, FGA",
            summary: "오라클 19c 환경에서 프로파일(Profile)을 통한 계정 자원 및 암호 관리를 다뤄보고, 표준 AUDIT 및 정밀 감사(FGA)의 기초 설정을 실습하며 데이터베이스 보안 및 접근 이력 추적 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224383618897"
        },
       {
            date: "2026-08-18",
            title: "39회차 - 오라클19c Control files 구성, archivelog 모드 변경, rman 기초설정",
            summary: "오라클 19c 환경에서 컨트롤 파일(Control Files) 다중화 구성을 진행하고, 데이터 보호를 위한 아카이브로그(ARCHIVELOG) 모드 전환과 RMAN(Recovery Manager)의 기초 환경 설정을 실습하며 백업 및 장애 복구 기반 구축 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224383022779"
        },
       {
            date: "2026-08-14",
            title: "38회차 - ASM사용을 위한 Oracle 19c restart 설치",
            summary: "오라클 19c 환경에서 ASM(Automatic Storage Management) 스토리지 활용을 위해 Oracle Grid Infrastructure(Oracle Restart)를 설치하고 구성해보며, 단일 인스턴스 환경의 고가용성 및 스토리지 관리 인프라 구축 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224378811817"
        },
       {
            date: "2026-08-13",
            title: "37회차 - PDB$SEED와 PDB이용해서 PDB복사하기",
            summary: "오라클 19c 멀티테넌트 환경에서 기본 템플릿인 PDB$SEED를 참조하여 새 PDB를 생성해보고, 기존 운영 중인 PDB를 복제(Cloning)하는 실습을 진행하며 플러그형 데이터베이스(PDB)의 효율적인 프로비저닝 및 복사 관리 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224377701341"
        },
       {
            date: "2026-08-12",
            title: "36회차 - 네트워크 local listner, 동적리스너, 정적리스너",
            summary: "오라클 19c 환경에서 local_listener 파라미터 설정을 다뤄보고, PMON/LREG 프로세스를 통한 동적 리스너 등록과 listener.ora 파일을 이용한 정적 리스너 구성 방식의 차이 및 기본 동작 원리를 파악하며 데이터베이스 네트워크 리스너 관리 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224376631467"
        },
       {
            date: "2026-08-11",
            title: "35회차 - 오라클19c 네트워크 연결 리스너, netmgr, tnsname.ora, sqlnet.ora",
            summary: "오라클 19c 환경에서 netmgr 툴을 활용한 기본 리스너(Listener) 구성을 실습하고, tnsnames.ora 및 sqlnet.ora 설정 파일 제어를 통해 클라이언트와 데이터베이스 서버 간의 네트워크 연동 및 접속 환경 구축 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224375465398"
        },
       {
            date: "2026-08-10",
            title: "34회차 - 오라클19c 공간사용개선(Improving Space Usage)과 UNDO Tablespace",
            summary: "오라클 19c 환경에서 스토리지 공간 사용 효율화(Improving Space Usage) 기법의 기본을 다뤄보고, 롤백 및 읽기 일관성을 지원하는 UNDO Tablespace의 생성과 관리 원리를 파악하며 데이터베이스 저장 공간 최적화 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224374244402"
        },
       {
            date: "2026-08-07",
            title: "33회차 - 오라클19c  DB만들기 실습, 테이블스페이스 생성 및 관리",
            summary: "오라클 19c 환경에서 데이터베이스 생성 절차를 실습하고, 테이블스페이스의 생성 및 용량 확장, 파일 이동 등 기본적인 스토리지 관리 작업을 직접 수행하며 데이터베이스 물리·논리 구조 운용 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224371350947"
        },
       {
            date: "2026-08-06",
            title: "32회차 - 오라클19c 테이블스페이스, 세그먼트, 익스텐트, 블락",
            summary: "오라클 19c의 핵심 논리적 저장 구조인 테이블스페이스(Tablespace), 세그먼트(Segment), 익스텐트(Extent), 블록(Block)의 계층적 관계와 기본 개념을 익히며, 데이터베이스 스토리지 할당 및 관리 체계를 이해하는 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224370429904"
        },
       {
            date: "2026-08-05",
            title: "31회차 - 오라클 19c 커맨드로 DB생성과 DBCA silent mode",
            summary: "CLI 커맨드를 통한 수동 데이터베이스 생성 절차를 익히고, DBCA(Database Configuration Assistant)의 Silent Mode를 활용하여 GUI 없이 응답 파일 기반으로 데이터베이스를 자동 배포하는 기초 실무 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224369189486"
        },
       {
            date: "2026-08-04",
            title: "30회차 - 오라클19c 데이터베이스 인스턴스",
            summary: "오라클 19c 데이터베이스 인스턴스의 시작(Startup) 및 종료(Shutdown) 단계별 동작 메커니즘을 익히고, 인스턴스와 데이터베이스 간의 상호작용 원리를 파악하며 데이터베이스 관리의 기초 운영 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224368317257"
        },
       {
            date: "2026-08-03",
            title: "29회차 - 오라클19c 인스턴스 프로세스 역할",
            summary: "오라클 19c 인스턴스를 구성하는 핵심 백그라운드 프로세스들의 기본 역할과 동작 방식을 학습하며, 메모리와 디스크 간의 데이터 처리 및 데이터베이스 운영 원리 전반을 이해하는 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224367164469"
        },
       {
            date: "2026-07-31",
            title: "28회차 - 오라클19c ADMIN( DB구조 문답 )",
            summary: "오라클19c ADMIN 기",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224364159041"
        },
       {
            date: "2026-07-30",
            title: "27회차 - 오라클19c ADMIN, oracle server 구조, Instance(SGA,PGA),DB(control files, data Files, redo log) ",
            summary: "오라클 19c 관리자(ADMIN) 기본 개념과 오라클 서버 아키텍처를 학습하며, SGA·PGA로 구성된 인스턴스(Instance) 메모리 영역과 컨트롤 파일, 데이터 파일, 리두 로그 파일로 이뤄진 데이터베이스(DB) 물리 구조의 기초 동작 원리를 이해하는 과정을 경험했습니다.",
            tags: ["Oracle","ADMIN","Architecture"],
            link: "https://blog.naver.com/10soong/224363071740"
        },
       {
            date: "2026-07-29",
            title: "26회차 - VMware 17설치, Linux7.9 설치, ORACLE19C 설치",
            summary: "VMware 17설치, Linux7.9 설치, ORACLE19C 설치",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224361978225"
        },
       {
            date: "2026-07-28",
            title: "25회차 - SQL Final Test ",
            summary: "SQL Final Test ",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224360780361"
        },
       {
            date: "2026-07-27",
            title: "24회차 - 오라클11g WITH clause,Recursive,REGEXP,ROLLUP,CUBE,GROUPING SETS,계층형 질의",
            summary: "WITH 절과 재귀적(Recursive) 쿼리, 정규표현식(REGEXP)의 기초 활용법을 학습하고, ROLLUP, CUBE, GROUPING SETS를 이용한 기본 데이터 집계와 계층형 질의의 기초 개념을 다루며 오라클 11g의 고급 SQL 작성 과정을 경험했습니다.",
            tags: ["Oracle","SQL"],
            link: "https://blog.naver.com/10soong/224359594106"
        },
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
            title: "Install",
            icon: "fas fa-server text-red-500", // 서버 느낌을 주기 위해 빨간색 서버 아이콘으로 변경
            children: [
                {
                    title: "ORACLE INSTALL",
                    icon: "fas fa-download text-gray-400",
                    files: [
                        { 
                            title: "Oracle 11g 설치 및 환경 구성", 
                            url: "./installs/oracle_11g.md", 
                            isQuiz: false
                        },
                        { 
                            title: "Oracle 19c 설치 및 환경 구성", 
                            url: "./installs/oracle_19c.md", 
                            isQuiz: false
                        },
                        { 
                            title: "Oracle 19c Grid (ASM) 구성", 
                            url: "./installs/oracle_restart.md", 
                            isQuiz: false
                        }
                    ]
                }
            ]
        },
        {
            title: "SQL",
            icon: "fas fa-database text-blue-400",
            children: [
                {
                    title: "PRACTICE & QUIZ",
                    icon: "fas fa-laptop-code text-gray-400",
                    files: [
                        { 
                            title: "사용자 접근 제어 SQL 실습 문제", 
                            url: "./quizzes/ch18.md", 
                            isQuiz: true, prefix: "ch18", quizId: "quiz-ch18",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "서브쿼리를 이용한 데이터 조작 SQL 실습 문제", 
                            url: "./quizzes/ch17.md", 
                            isQuiz: true, prefix: "ch17", quizId: "quiz-ch17",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "서브쿼리를 이용한 데이터 조회 SQL 실습 문제", 
                            url: "./quizzes/ch16.md", 
                            isQuiz: true, prefix: "ch16", quizId: "quiz-ch16",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "스키마 객체 관리 SQL 실습 문제 30문제", 
                            url: "./quizzes/ch15.md", 
                            isQuiz: true, prefix: "ch15", quizId: "quiz-ch15",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "뷰(View) 생성, 수정 & 복합 뷰 실습 문제 (30문항)", 
                            url: "./quizzes/ch14.md", 
                            isQuiz: true, prefix: "ch14", quizId: "quiz-ch14",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "시퀀스, 동의어, 인덱스 생성 실습 문제 (30문항)", 
                            url: "./quizzes/ch13.md", 
                            isQuiz: true, prefix: "ch13", quizId: "quiz-ch13",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "데이터 딕셔너리 뷰 실습 문제 (30문항)", 
                            url: "./quizzes/ch12.md", 
                            isQuiz: true, prefix: "ch12", quizId: "quiz-ch12",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "데이터 정의 언어(DDL) 소개", 
                            url: "./quizzes/ch11.md", 
                            isQuiz: true, prefix: "ch11", quizId: "quiz-ch11",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "DML 문을 사용한 테이블 관리 실습 문제 (30문항)", 
                            url: "./quizzes/ch10.md", 
                            isQuiz: true, prefix: "ch10", quizId: "quiz-ch10",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "집합 연산자 사용 실습 문제 (30문항)", 
                            url: "./quizzes/ch09.md", 
                            isQuiz: true, prefix: "ch09", quizId: "quiz-ch09",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "서브쿼리를 활용한 쿼리 작성 실습 문제", 
                            url: "./quizzes/ch08.md", 
                            isQuiz: true, prefix: "ch08", quizId: "quiz-ch08",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "JOIN(다중 테이블 조회) 실습 문제 (30문항)", 
                            url: "./quizzes/ch07.md", 
                            isQuiz: true, prefix: "ch07", quizId: "quiz-ch07",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "그룹 함수 실습 문제 (30문항)", 
                            url: "./quizzes/ch06.md", 
                            isQuiz: true, prefix: "ch06", quizId: "quiz-ch06",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "변환 함수와 조건식 실습 문제 (30문항)", 
                            url: "./quizzes/ch05.md", 
                            isQuiz: true, prefix: "ch05", quizId: "quiz-ch05",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "단일행 함수 실습 문제 (30문항)", 
                            url: "./quizzes/ch04.md", 
                            isQuiz: true, prefix: "ch04", quizId: "quiz-ch04",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        },
                        { 
                            title: "데이터 제한 및 정렬 실습 문제 (30문항)", 
                            url: "./quizzes/ch03.md", 
                            isQuiz: true, prefix: "ch03", quizId: "quiz-ch03",
                            guide: "DB버전: Oracle Database 11g / 사용 스키마: HR"
                        }
                        
                    ]
                    
                },
                // 💡 [새로 추가된 부분] 미니 프로젝트 폴더
                {
                    title: "MiniProject",
                    icon: "fas fa-project-diagram text-purple-400", // 보라색 프로젝트 아이콘
                    files: [
                        {
                            title: "비디오 대여점 DB 구축 모델링",
                            url: "#", // fetch를 타지 않으므로 임시 주소
                            isProject: true, // 🌟 프로젝트임을 알리는 플래그
                            projectId: "proj-01" // 기존 데이터에 있는 미니 프로젝트 ID 연동
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
                    title: "BACKUP",
                    icon: "fas fa-hdd text-emerald-400", // 물리적 디스크/저장소 느낌의 아이콘 (에메랄드색)
                    files: [
                    {
                        "title": "Cold_Backup",
                        "url": "./skills/01.BACKUP/Cold_Backup.md"
                    },
                    {
                        "title": "Hot_Backup",
                        "url": "./skills/01.BACKUP/Hot_Backup.md"
                    },
                    {
                        "title": "컨트롤파일 백업",
                        "url": "./skills/01.BACKUP/컨트롤파일 백업.md"
                    },
                    {
                        "title": "컨트롤파일 생성",
                        "url": "./skills/01.BACKUP/컨트롤파일 생성.md"
                    }
                        // 여기에 BACKUP 관련 md 파일 객체들이 들어갑니다.
                        // { title: "...", url: "..." }
                    ]
                },
                {
                    title: "ARCHIVE MODE",
                    icon: "fas fa-archive text-yellow-400",
                    files: [
                        {
                        "title": "리두 로그와 컨트롤파일 손상 (정상 종료)",
                        "url": "./skills/02.ARCHIVE MODE/ARC_ 리두 로그와 컨트롤파일 손상 (정상 종료).md"
                    },
                    {
                        "title": "CLEAR UNARCHIVED LOGFILE 을 이용한 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CLEAR UNARCHIVED LOGFILE 을 이용한 복구.md"
                    },
                    {
                        "title": "CURRENT 리두 로그 삭제 후 비정상 종료",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CURRENT 리두 로그 삭제 후 비정상 종료.md"
                    },
                    {
                        "title": "CURRENT 리두 로그 삭제 후 정상 종료",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CURRENT 리두 로그 삭제 후 정상 종료.md"
                    },
                    {
                        "title": "Cold Backup 기반 불완전 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Cold Backup 기반 불완전 복구.md"
                    },
                    {
                        "title": "Hot Backup 기반 불완전 복구 — 최소 복구 지점 1",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Hot Backup 기반 불완전 복구 — 최소 복구 지점 1.md"
                    },
                    {
                        "title": "Hot Backup 기반 불완전 복구 — 최소 복구 지점",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Hot Backup 기반 불완전 복구 — 최소 복구 지점.md"
                    },
                    {
                        "title": "INACTIVE 리두 로그 삭제 — 정상 종료 후와 운영 중",
                        "url": "./skills/02.ARCHIVE MODE/ARC_INACTIVE 리두 로그 삭제 — 정상 종료 후와 운영 중.md"
                    },
                    {
                        "title": "SCN-based 불완전 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_SCN-based 불완전 복구.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일과 컨트롤파일 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_SYSTEM 데이터파일과 컨트롤파일 손상.md"
                    },
                    {
                        "title": "Sequence-based 불완전 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Sequence-based 불완전 복구.md"
                    },
                    {
                        "title": "Time-based 불완전 복구와 READ ONLY 검증",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Time-based 불완전 복구와 READ ONLY 검증.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_UNDO 데이터파일 손상 복구.md"
                    },
                    {
                        "title": "archive member 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_archive member 손상.md"
                    },
                    {
                        "title": "데이터파일을 새 위치로 복구 — RENAME FILE",
                        "url": "./skills/02.ARCHIVE MODE/ARC_데이터파일을 새 위치로 복구 — RENAME FILE.md"
                    },
                    {
                        "title": "로그 스위치로 정지된 상태의 진단과 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_로그 스위치로 정지된 상태의 진단과 복구.md"
                    },
                    {
                        "title": "모든 데이터파일 손상 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든 데이터파일 손상 복구.md"
                    },
                    {
                        "title": "모든 데이터파일과 컨트롤파일 동시 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든 데이터파일과 컨트롤파일 동시 손상.md"
                    },
                    {
                        "title": "모든 데이터파일을 새 위치로 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든 데이터파일을 새 위치로 복구.md"
                    },
                    {
                        "title": "백업 받지 않은 테이블스페이스를 새 위치로 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업 받지 않은 테이블스페이스를 새 위치로 복구.md"
                    },
                    {
                        "title": "백업 받지 않은 테이블스페이스의 데이터파일 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업 받지 않은 테이블스페이스의 데이터파일 복구.md"
                    },
                    {
                        "title": "백업 컨트롤파일과 현재 구조 불일치 보정",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업 컨트롤파일과 현재 구조 불일치 보정.md"
                    },
                    {
                        "title": "비정상 종료 후 컨트롤파일 손상 — 재생성",
                        "url": "./skills/02.ARCHIVE MODE/ARC_비정상 종료 후 컨트롤파일 손상 — 재생성.md"
                    },
                    {
                        "title": "아카이브 손상 — Cancel-based 불완전 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브 손상 — Cancel-based 불완전 복구.md"
                    },
                    {
                        "title": "아카이브 용량 초과로 DB정지",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브 용량 초과로 DB정지.md"
                    },
                    {
                        "title": "아카이브가 일부 삭제되었어도 온라인 리두로 완전 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브가 일부 삭제되었어도 온라인 리두로 완전 복구.md"
                    },
                    {
                        "title": "오프라인 상태 테이블스페이스의 데이터파일 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_오프라인 상태 테이블스페이스의 데이터파일 손상.md"
                    },
                    {
                        "title": "운영 중 CURRENT 리두 로그 삭제",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영 중 CURRENT 리두 로그 삭제.md"
                    },
                    {
                        "title": "운영 중 UNDO 손상과 테이블스페이스 전환",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영 중 UNDO 손상과 테이블스페이스 전환.md"
                    },
                    {
                        "title": "운영 중 데이터파일 손상 — 무중단 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영 중 데이터파일 손상 — 무중단 복구.md"
                    },
                    {
                        "title": "일반 데이터파일 + INACTIVE 리두 + 컨트롤파일 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_일반 데이터파일 + INACTIVE 리두 + 컨트롤파일 손상.md"
                    },
                    {
                        "title": "읽기 전용 테이블스페이스 복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_읽기 전용 테이블스페이스 복구.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체 손실 — 아카이브 보유.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Cold Backup 보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체 손실 — 아카이브 없음, Cold Backup 보유.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Hot Backup만 보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체 손실 — 아카이브 없음, Hot Backup만 보유.md"
                    },
                    {
                        "title": "정상 종료 후 여러 데이터파일 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상 종료 후 여러 데이터파일 손상.md"
                    },
                    {
                        "title": "정상 종료 후 컨트롤파일 손상 — Binary 백업본 사용",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상 종료 후 컨트롤파일 손상 — Binary 백업본 사용.md"
                    },
                    {
                        "title": "정상 종료 후 컨트롤파일 손상 — trace 재생성",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상 종료 후 컨트롤파일 손상 — trace 재생성.md"
                    },
                    {
                        "title": "테이블스페이스의 여러 파일 중 특정 파일만 손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_테이블스페이스의 여러 파일 중 특정 파일만 손상.md"
                    }
                ]
            },
            {
                "title": "NOARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "No 백업TS No Online_Redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_No 백업TS No Online_Redo.md"
                    },
                    {
                        "title": "No 백업TS Yes Online_Redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_No 백업TS Yes Online_Redo.md"
                    },
                    {
                        "title": "SYSAUX 데이터파일 손상 — SYSTEM과의 차이 확인",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSAUX 데이터파일 손상 — SYSTEM과의 차이 확인.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일 손상 — 리두 없음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSTEM 데이터파일 손상 — 리두 없음.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일 손상 — 리두 있음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSTEM 데이터파일 손상 — 리두 있음.md"
                    },
                    {
                        "title": "TEMP 파일 손상과 재생성",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_TEMP 파일 손상과 재생성.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 — 리두 없음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_UNDO 데이터파일 손상 — 리두 없음.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 — 리두 있음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_UNDO 데이터파일 손상 — 리두 있음.md"
                    },
                    {
                        "title": "read only 테이블스페이스 손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_read only 테이블스페이스 손상.md"
                    },
                    {
                        "title": "디스크 전체 손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_디스크 전체 손상.md"
                    },
                    {
                        "title": "리두 로그가 빠진 백업본으로 복구",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리두 로그가 빠진 백업본으로 복구.md"
                    },
                    {
                        "title": "리커버리_데이터파일 손상_noarchive & no redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리커버리_데이터파일 손상_noarchive & no redo.md"
                    },
                    {
                        "title": "리커버리_데이터파일 손상_noarchive & redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리커버리_데이터파일 손상_noarchive & redo.md"
                    },
                    {
                        "title": "컨트롤파일 전체 손상 — Binary 백업본으로 복구",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_컨트롤파일 전체 손상 — Binary 백업본으로 복구.md"
                    },
                    {
                        "title": "컨트롤파일 전체 손상 — trace로 재생성",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_컨트롤파일 전체 손상 — trace로 재생성.md"
                    },
                    {
                        "title": "트랜잭션 진행 중 UNDO 손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_트랜잭션 진행 중 UNDO 손상.md"
                    }
                    ]
                },
                {
                    title: "RMAN",
                    icon: "fas fa-shield-alt text-green-400", // 강력한 복구 관리자/보호 느낌의 방패 아이콘 (초록색)
                    files: [
                        // 여기에 RMAN 관련 md 파일 객체들이 들어갑니다.
                    ]
                }
            ]
        },
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

