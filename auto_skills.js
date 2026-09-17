// ⚠️ 이 파일은 generate_skills.js에 의해 자동 생성됩니다. 직접 수정하지 마세요.

const AUTO_SKILLS_DATA = [
    {
        "title": "ORACLE DBA SKILLS",
        "icon": "fas fa-database text-blue-400",
        "children": [
            {
                "title": "BACKUP",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
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
                ]
            },
            {
                "title": "ARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
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
            }
        ]
    }
];