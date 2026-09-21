// ⚠️ 이 파일은 Python 스크립트(generate_skills.py)에 의해 자동 생성됩니다.
// 직접 수정하지 마세요.

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
                        "title": "Cold Backup",
                        "url": "/skills/01.BACKUP/Cold_Backup.md"
                    },
                    {
                        "title": "Hot Backup",
                        "url": "/skills/01.BACKUP/Hot_Backup.md"
                    },
                    {
                        "title": "컨트롤파일 백업",
                        "url": "/skills/01.BACKUP/컨트롤파일_백업.md"
                    },
                    {
                        "title": "컨트롤파일 생성",
                        "url": "/skills/01.BACKUP/컨트롤파일_생성.md"
                    }
                ]
            },
            {
                "title": "ARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "CLEAR UNARCHIVED LOGFILE 을 이용한 복구",
                        "url": "/skills/02.ARCHIVE_MODE/CLEAR_UNARCHIVED_LOGFILE_을_이용한_복구.md"
                    },
                    {
                        "title": "CURRENT 리두 로그 삭제 후 비정상 종료",
                        "url": "/skills/02.ARCHIVE_MODE/CURRENT_리두_로그_삭제_후_비정상_종료.md"
                    },
                    {
                        "title": "CURRENT 리두 로그 삭제 후 정상 종료",
                        "url": "/skills/02.ARCHIVE_MODE/CURRENT_리두_로그_삭제_후_정상_종료.md"
                    },
                    {
                        "title": "Cold Backup 기반 불완전 복구",
                        "url": "/skills/02.ARCHIVE_MODE/Cold_Backup_기반_불완전_복구.md"
                    },
                    {
                        "title": "Hot Backup 기반 불완전 복구 — 최소 복구 지점",
                        "url": "/skills/02.ARCHIVE_MODE/Hot_Backup_기반_불완전_복구_—_최소_복구_지점.md"
                    },
                    {
                        "title": "Hot Backup 기반 불완전 복구 — 최소 복구 지점 1",
                        "url": "/skills/02.ARCHIVE_MODE/Hot_Backup_기반_불완전_복구_—_최소_복구_지점_1.md"
                    },
                    {
                        "title": "INACTIVE 리두 로그 삭제 — 정상 종료 후와 운영 중",
                        "url": "/skills/02.ARCHIVE_MODE/INACTIVE_리두_로그_삭제_—_정상_종료_후와_운영_중.md"
                    },
                    {
                        "title": "SCN-based 불완전 복구",
                        "url": "/skills/02.ARCHIVE_MODE/SCN-based_불완전_복구.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일과 컨트롤파일 손상",
                        "url": "/skills/02.ARCHIVE_MODE/SYSTEM_데이터파일과_컨트롤파일_손상.md"
                    },
                    {
                        "title": "Sequence-based 불완전 복구",
                        "url": "/skills/02.ARCHIVE_MODE/Sequence-based_불완전_복구.md"
                    },
                    {
                        "title": "Time-based 불완전 복구와 READ ONLY 검증",
                        "url": "/skills/02.ARCHIVE_MODE/Time-based_불완전_복구와_READ_ONLY_검증.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 복구",
                        "url": "/skills/02.ARCHIVE_MODE/UNDO_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "archive member 손상",
                        "url": "/skills/02.ARCHIVE_MODE/archive_member_손상.md"
                    },
                    {
                        "title": "데이터파일을 새 위치로 복구 — RENAME FILE",
                        "url": "/skills/02.ARCHIVE_MODE/데이터파일을_새_위치로_복구_—_RENAME_FILE.md"
                    },
                    {
                        "title": "로그 스위치로 정지된 상태의 진단과 복구",
                        "url": "/skills/02.ARCHIVE_MODE/로그_스위치로_정지된_상태의_진단과_복구.md"
                    },
                    {
                        "title": "리두 로그와 컨트롤파일 손상 (정상 종료)",
                        "url": "/skills/02.ARCHIVE_MODE/리두_로그와_컨트롤파일_손상_(정상_종료).md"
                    },
                    {
                        "title": "모든 데이터파일 손상 복구",
                        "url": "/skills/02.ARCHIVE_MODE/모든_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "모든 데이터파일과 컨트롤파일 동시 손상",
                        "url": "/skills/02.ARCHIVE_MODE/모든_데이터파일과_컨트롤파일_동시_손상.md"
                    },
                    {
                        "title": "모든 데이터파일을 새 위치로 복구",
                        "url": "/skills/02.ARCHIVE_MODE/모든_데이터파일을_새_위치로_복구.md"
                    },
                    {
                        "title": "백업 받지 않은 테이블스페이스를 새 위치로 복구",
                        "url": "/skills/02.ARCHIVE_MODE/백업_받지_않은_테이블스페이스를_새_위치로_복구.md"
                    },
                    {
                        "title": "백업 받지 않은 테이블스페이스의 데이터파일 복구",
                        "url": "/skills/02.ARCHIVE_MODE/백업_받지_않은_테이블스페이스의_데이터파일_복구.md"
                    },
                    {
                        "title": "백업 컨트롤파일과 현재 구조 불일치 보정",
                        "url": "/skills/02.ARCHIVE_MODE/백업_컨트롤파일과_현재_구조_불일치_보정.md"
                    },
                    {
                        "title": "비정상 종료 후 컨트롤파일 손상 — 재생성",
                        "url": "/skills/02.ARCHIVE_MODE/비정상_종료_후_컨트롤파일_손상_—_재생성.md"
                    },
                    {
                        "title": "아카이브 손상 — Cancel-based 불완전 복구",
                        "url": "/skills/02.ARCHIVE_MODE/아카이브_손상_—_Cancel-based_불완전_복구.md"
                    },
                    {
                        "title": "아카이브 용량 초과로 DB정지",
                        "url": "/skills/02.ARCHIVE_MODE/아카이브_용량_초과로_DB정지.md"
                    },
                    {
                        "title": "아카이브가 일부 삭제되었어도 온라인 리두로 완전 복구",
                        "url": "/skills/02.ARCHIVE_MODE/아카이브가_일부_삭제되었어도_온라인_리두로_완전_복구.md"
                    },
                    {
                        "title": "오프라인 상태 테이블스페이스의 데이터파일 손상",
                        "url": "/skills/02.ARCHIVE_MODE/오프라인_상태_테이블스페이스의_데이터파일_손상.md"
                    },
                    {
                        "title": "운영 중 CURRENT 리두 로그 삭제",
                        "url": "/skills/02.ARCHIVE_MODE/운영_중_CURRENT_리두_로그_삭제.md"
                    },
                    {
                        "title": "운영 중 UNDO 손상과 테이블스페이스 전환",
                        "url": "/skills/02.ARCHIVE_MODE/운영_중_UNDO_손상과_테이블스페이스_전환.md"
                    },
                    {
                        "title": "운영 중 데이터파일 손상 — 무중단 복구",
                        "url": "/skills/02.ARCHIVE_MODE/운영_중_데이터파일_손상_—_무중단_복구.md"
                    },
                    {
                        "title": "일반 데이터파일 + INACTIVE 리두 + 컨트롤파일 손상",
                        "url": "/skills/02.ARCHIVE_MODE/일반_데이터파일_+_INACTIVE_리두_+_컨트롤파일_손상.md"
                    },
                    {
                        "title": "읽기 전용 테이블스페이스 복구",
                        "url": "/skills/02.ARCHIVE_MODE/읽기_전용_테이블스페이스_복구.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 보유",
                        "url": "/skills/02.ARCHIVE_MODE/전체_손실_—_아카이브_보유.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Cold Backup 보유",
                        "url": "/skills/02.ARCHIVE_MODE/전체_손실_—_아카이브_없음,_Cold_Backup_보유.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Cold Backup 보유 1",
                        "url": "/skills/02.ARCHIVE_MODE/전체_손실_—_아카이브_없음,_Cold_Backup_보유_1.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Hot Backup만 보유",
                        "url": "/skills/02.ARCHIVE_MODE/전체_손실_—_아카이브_없음,_Hot_Backup만_보유.md"
                    },
                    {
                        "title": "전체 손실 — 아카이브 없음, Hot Backup만 보유 1",
                        "url": "/skills/02.ARCHIVE_MODE/전체_손실_—_아카이브_없음,_Hot_Backup만_보유_1.md"
                    },
                    {
                        "title": "정상 종료 후 여러 데이터파일 손상",
                        "url": "/skills/02.ARCHIVE_MODE/정상_종료_후_여러_데이터파일_손상.md"
                    },
                    {
                        "title": "정상 종료 후 컨트롤파일 손상 — Binary 백업본 사용",
                        "url": "/skills/02.ARCHIVE_MODE/정상_종료_후_컨트롤파일_손상_—_Binary_백업본_사용.md"
                    },
                    {
                        "title": "정상 종료 후 컨트롤파일 손상 — trace 재생성",
                        "url": "/skills/02.ARCHIVE_MODE/정상_종료_후_컨트롤파일_손상_—_trace_재생성.md"
                    },
                    {
                        "title": "테이블스페이스의 여러 파일 중 특정 파일만 손상",
                        "url": "/skills/02.ARCHIVE_MODE/테이블스페이스의_여러_파일_중_특정_파일만_손상.md"
                    }
                ]
            },
            {
                "title": "NOARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "No 백업TS No Online Redo",
                        "url": "/skills/03.NOARCHIVE_MODE/No_백업TS_No_Online_Redo.md"
                    },
                    {
                        "title": "No 백업TS Yes Online Redo",
                        "url": "/skills/03.NOARCHIVE_MODE/No_백업TS_Yes_Online_Redo.md"
                    },
                    {
                        "title": "SYSAUX 데이터파일 손상 — SYSTEM과의 차이 확인",
                        "url": "/skills/03.NOARCHIVE_MODE/SYSAUX_데이터파일_손상_—_SYSTEM과의_차이_확인.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일 손상 — 리두 없음",
                        "url": "/skills/03.NOARCHIVE_MODE/SYSTEM_데이터파일_손상_—_리두_없음.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일 손상 — 리두 있음",
                        "url": "/skills/03.NOARCHIVE_MODE/SYSTEM_데이터파일_손상_—_리두_있음.md"
                    },
                    {
                        "title": "TEMP 파일 손상과 재생성",
                        "url": "/skills/03.NOARCHIVE_MODE/TEMP_파일_손상과_재생성.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 — 리두 없음",
                        "url": "/skills/03.NOARCHIVE_MODE/UNDO_데이터파일_손상_—_리두_없음.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 — 리두 있음",
                        "url": "/skills/03.NOARCHIVE_MODE/UNDO_데이터파일_손상_—_리두_있음.md"
                    },
                    {
                        "title": "read only 테이블스페이스 손상",
                        "url": "/skills/03.NOARCHIVE_MODE/read_only_테이블스페이스_손상.md"
                    },
                    {
                        "title": "디스크 전체 손상",
                        "url": "/skills/03.NOARCHIVE_MODE/디스크_전체_손상.md"
                    },
                    {
                        "title": "리두 로그가 빠진 백업본으로 복구",
                        "url": "/skills/03.NOARCHIVE_MODE/리두_로그가_빠진_백업본으로_복구.md"
                    },
                    {
                        "title": "리커버리 데이터파일 손상 noarchive & no redo",
                        "url": "/skills/03.NOARCHIVE_MODE/리커버리_데이터파일_손상_noarchive_&_no_redo.md"
                    },
                    {
                        "title": "리커버리 데이터파일 손상 noarchive & redo",
                        "url": "/skills/03.NOARCHIVE_MODE/리커버리_데이터파일_손상_noarchive_&_redo.md"
                    },
                    {
                        "title": "컨트롤파일 전체 손상 — Binary 백업본으로 복구",
                        "url": "/skills/03.NOARCHIVE_MODE/컨트롤파일_전체_손상_—_Binary_백업본으로_복구.md"
                    },
                    {
                        "title": "컨트롤파일 전체 손상 — trace로 재생성",
                        "url": "/skills/03.NOARCHIVE_MODE/컨트롤파일_전체_손상_—_trace로_재생성.md"
                    },
                    {
                        "title": "트랜잭션 진행 중 UNDO 손상",
                        "url": "/skills/03.NOARCHIVE_MODE/트랜잭션_진행_중_UNDO_손상.md"
                    }
                ]
            },
            {
                "title": "RMAN",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "Block Change Tracking 활성화와 효과 확인",
                        "url": "/skills/04.RMAN/Block_Change_Tracking_활성화와_효과_확인.md"
                    },
                    {
                        "title": "CONFIGURE 영구 설정과 SHOW ALL 확인",
                        "url": "/skills/04.RMAN/CONFIGURE_영구_설정과_SHOW_ALL_확인.md"
                    },
                    {
                        "title": "Image Copy(BACKUP AS COPY)와 SWITCH를 이용한 즉시 복구",
                        "url": "/skills/04.RMAN/Image_Copy(BACKUP_AS_COPY)와_SWITCH를_이용한_즉시_복구.md"
                    },
                    {
                        "title": "LIST REPORT 조회와 CROSSCHECK",
                        "url": "/skills/04.RMAN/LIST_REPORT_조회와_CROSSCHECK.md"
                    },
                    {
                        "title": "RESYNC CATALOG와 Stored Script 등록·실행",
                        "url": "/skills/04.RMAN/RESYNC_CATALOG와_Stored_Script_등록·실행.md"
                    },
                    {
                        "title": "RMAN 백업 암호화 SET ENCRYPTION ON",
                        "url": "/skills/04.RMAN/RMAN_백업_암호화_SET_ENCRYPTION_ON.md"
                    },
                    {
                        "title": "Retention Policy 설정과 REPORT DELETE OBSOLETE",
                        "url": "/skills/04.RMAN/Retention_Policy_설정과_REPORT_DELETE_OBSOLETE.md"
                    },
                    {
                        "title": "SYSTEM 데이터파일 손상 복구",
                        "url": "/skills/04.RMAN/SYSTEM_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "UNDO 데이터파일 손상 복구",
                        "url": "/skills/04.RMAN/UNDO_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "데이터파일 유실 복구 RESTORE  RECOVER",
                        "url": "/skills/04.RMAN/데이터파일_유실_복구_RESTORE__RECOVER.md"
                    },
                    {
                        "title": "모든 데이터파일 손상 복구",
                        "url": "/skills/04.RMAN/모든_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "모든 데이터파일을 새 위치로 복구",
                        "url": "/skills/04.RMAN/모든_데이터파일을_새_위치로_복구.md"
                    },
                    {
                        "title": "백업받지 않은 테이블스페이스의 데이터파일 복구 V",
                        "url": "/skills/04.RMAN/백업받지_않은_테이블스페이스의_데이터파일_복구_V.md"
                    },
                    {
                        "title": "압축 백업과 백업 조각 크기 조정",
                        "url": "/skills/04.RMAN/압축_백업과_백업_조각_크기_조정.md"
                    },
                    {
                        "title": "일반 테이블스페이스를 다른 위치로 복구 — SET NEWNAME  SWITCH",
                        "url": "/skills/04.RMAN/일반_테이블스페이스를_다른_위치로_복구_—_SET_NEWNAME__SWITCH.md"
                    },
                    {
                        "title": "증분 백업 Level 0&1 누적과 차등 비교",
                        "url": "/skills/04.RMAN/증분_백업_Level_0&1_누적과_차등_비교.md"
                    },
                    {
                        "title": "컨트롤파일 손상 복구 카탈로그와 자동 백업",
                        "url": "/skills/04.RMAN/컨트롤파일_손상_복구_카탈로그와_자동_백업.md"
                    },
                    {
                        "title": "테이블스페이스·데이터파일 단위 백업",
                        "url": "/skills/04.RMAN/테이블스페이스·데이터파일_단위_백업.md"
                    }
                ]
            }
        ]
    }
];