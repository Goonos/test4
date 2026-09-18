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
                        "title": "컨트롤파일_백업",
                        "url": "./skills/01.BACKUP/컨트롤파일_백업.md"
                    },
                    {
                        "title": "컨트롤파일_생성",
                        "url": "./skills/01.BACKUP/컨트롤파일_생성.md"
                    }
                ]
            },
            {
                "title": "ARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "ARC_CLEAR_UNARCHIVED_LOGFILE_을_이용한_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CLEAR_UNARCHIVED_LOGFILE_을_이용한_복구.md"
                    },
                    {
                        "title": "ARC_CURRENT_리두_로그_삭제_후_비정상_종료",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CURRENT_리두_로그_삭제_후_비정상_종료.md"
                    },
                    {
                        "title": "ARC_CURRENT_리두_로그_삭제_후_정상_종료",
                        "url": "./skills/02.ARCHIVE MODE/ARC_CURRENT_리두_로그_삭제_후_정상_종료.md"
                    },
                    {
                        "title": "ARC_Cold_Backup_기반_불완전_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Cold_Backup_기반_불완전_복구.md"
                    },
                    {
                        "title": "ARC_Hot_Backup_기반_불완전_복구_—_최소_복구_지점_1",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Hot_Backup_기반_불완전_복구_—_최소_복구_지점_1.md"
                    },
                    {
                        "title": "ARC_INACTIVE_리두_로그_삭제_—_정상_종료_후와_운영_중",
                        "url": "./skills/02.ARCHIVE MODE/ARC_INACTIVE_리두_로그_삭제_—_정상_종료_후와_운영_중.md"
                    },
                    {
                        "title": "ARC_SCN-based_불완전_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_SCN-based_불완전_복구.md"
                    },
                    {
                        "title": "ARC_SYSTEM_데이터파일과_컨트롤파일_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_SYSTEM_데이터파일과_컨트롤파일_손상.md"
                    },
                    {
                        "title": "ARC_Sequence-based_불완전_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Sequence-based_불완전_복구.md"
                    },
                    {
                        "title": "ARC_Time-based_불완전_복구와_READ_ONLY_검증",
                        "url": "./skills/02.ARCHIVE MODE/ARC_Time-based_불완전_복구와_READ_ONLY_검증.md"
                    },
                    {
                        "title": "ARC_UNDO_데이터파일_손상_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_UNDO_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "ARC__리두_로그와_컨트롤파일_손상_(정상_종료)",
                        "url": "./skills/02.ARCHIVE MODE/ARC__리두_로그와_컨트롤파일_손상_(정상_종료).md"
                    },
                    {
                        "title": "ARC_archive_member_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_archive_member_손상.md"
                    },
                    {
                        "title": "ARC_데이터파일을_새_위치로_복구_—_RENAME_FILE",
                        "url": "./skills/02.ARCHIVE MODE/ARC_데이터파일을_새_위치로_복구_—_RENAME_FILE.md"
                    },
                    {
                        "title": "ARC_로그_스위치로_정지된_상태의_진단과_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_로그_스위치로_정지된_상태의_진단과_복구.md"
                    },
                    {
                        "title": "ARC_모든_데이터파일_손상_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "ARC_모든_데이터파일과_컨트롤파일_동시_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든_데이터파일과_컨트롤파일_동시_손상.md"
                    },
                    {
                        "title": "ARC_모든_데이터파일을_새_위치로_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_모든_데이터파일을_새_위치로_복구.md"
                    },
                    {
                        "title": "ARC_백업_받지_않은_테이블스페이스를_새_위치로_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업_받지_않은_테이블스페이스를_새_위치로_복구.md"
                    },
                    {
                        "title": "ARC_백업_받지_않은_테이블스페이스의_데이터파일_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업_받지_않은_테이블스페이스의_데이터파일_복구.md"
                    },
                    {
                        "title": "ARC_백업_컨트롤파일과_현재_구조_불일치_보정",
                        "url": "./skills/02.ARCHIVE MODE/ARC_백업_컨트롤파일과_현재_구조_불일치_보정.md"
                    },
                    {
                        "title": "ARC_비정상_종료_후_컨트롤파일_손상_—_재생성",
                        "url": "./skills/02.ARCHIVE MODE/ARC_비정상_종료_후_컨트롤파일_손상_—_재생성.md"
                    },
                    {
                        "title": "ARC_아카이브_손상_—_Cancel-based_불완전_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브_손상_—_Cancel-based_불완전_복구.md"
                    },
                    {
                        "title": "ARC_아카이브_용량_초과로_DB정지",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브_용량_초과로_DB정지.md"
                    },
                    {
                        "title": "ARC_아카이브가_일부_삭제되었어도_온라인_리두로_완전_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_아카이브가_일부_삭제되었어도_온라인_리두로_완전_복구.md"
                    },
                    {
                        "title": "ARC_오프라인_상태_테이블스페이스의_데이터파일_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_오프라인_상태_테이블스페이스의_데이터파일_손상.md"
                    },
                    {
                        "title": "ARC_운영_중_CURRENT_리두_로그_삭제",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영_중_CURRENT_리두_로그_삭제.md"
                    },
                    {
                        "title": "ARC_운영_중_UNDO_손상과_테이블스페이스_전환",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영_중_UNDO_손상과_테이블스페이스_전환.md"
                    },
                    {
                        "title": "ARC_운영_중_데이터파일_손상_—_무중단_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_운영_중_데이터파일_손상_—_무중단_복구.md"
                    },
                    {
                        "title": "ARC_일반_데이터파일_+_INACTIVE_리두_+_컨트롤파일_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_일반_데이터파일_+_INACTIVE_리두_+_컨트롤파일_손상.md"
                    },
                    {
                        "title": "ARC_읽기_전용_테이블스페이스_복구",
                        "url": "./skills/02.ARCHIVE MODE/ARC_읽기_전용_테이블스페이스_복구.md"
                    },
                    {
                        "title": "ARC_전체_손실_—_아카이브_보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체_손실_—_아카이브_보유.md"
                    },
                    {
                        "title": "ARC_전체_손실_—_아카이브_없음,_Cold_Backup_보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체_손실_—_아카이브_없음,_Cold_Backup_보유.md"
                    },
                    {
                        "title": "ARC_전체_손실_—_아카이브_없음,_Cold_Backup_보유_1",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체_손실_—_아카이브_없음,_Cold_Backup_보유_1.md"
                    },
                    {
                        "title": "ARC_전체_손실_—_아카이브_없음,_Hot_Backup만_보유",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체_손실_—_아카이브_없음,_Hot_Backup만_보유.md"
                    },
                    {
                        "title": "ARC_전체_손실_—_아카이브_없음,_Hot_Backup만_보유_1",
                        "url": "./skills/02.ARCHIVE MODE/ARC_전체_손실_—_아카이브_없음,_Hot_Backup만_보유_1.md"
                    },
                    {
                        "title": "ARC_정상_종료_후_여러_데이터파일_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상_종료_후_여러_데이터파일_손상.md"
                    },
                    {
                        "title": "ARC_정상_종료_후_컨트롤파일_손상_—_Binary_백업본_사용",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상_종료_후_컨트롤파일_손상_—_Binary_백업본_사용.md"
                    },
                    {
                        "title": "ARC_정상_종료_후_컨트롤파일_손상_—_trace_재생성",
                        "url": "./skills/02.ARCHIVE MODE/ARC_정상_종료_후_컨트롤파일_손상_—_trace_재생성.md"
                    },
                    {
                        "title": "ARC_테이블스페이스의_여러_파일_중_특정_파일만_손상",
                        "url": "./skills/02.ARCHIVE MODE/ARC_테이블스페이스의_여러_파일_중_특정_파일만_손상.md"
                    },
                    {
                        "title": "Hot_Backup_기반_불완전_복구_—_최소_복구_지점",
                        "url": "./skills/02.ARCHIVE MODE/Hot_Backup_기반_불완전_복구_—_최소_복구_지점.md"
                    }
                ]
            },
            {
                "title": "NOARCHIVE MODE",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "NOARC_No_백업TS_No_Online_Redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_No_백업TS_No_Online_Redo.md"
                    },
                    {
                        "title": "NOARC_No_백업TS_Yes_Online_Redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_No_백업TS_Yes_Online_Redo.md"
                    },
                    {
                        "title": "NOARC_SYSAUX_데이터파일_손상_—_SYSTEM과의_차이_확인",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSAUX_데이터파일_손상_—_SYSTEM과의_차이_확인.md"
                    },
                    {
                        "title": "NOARC_SYSTEM_데이터파일_손상_—_리두_없음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSTEM_데이터파일_손상_—_리두_없음.md"
                    },
                    {
                        "title": "NOARC_SYSTEM_데이터파일_손상_—_리두_있음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_SYSTEM_데이터파일_손상_—_리두_있음.md"
                    },
                    {
                        "title": "NOARC_TEMP_파일_손상과_재생성",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_TEMP_파일_손상과_재생성.md"
                    },
                    {
                        "title": "NOARC_UNDO_데이터파일_손상_—_리두_없음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_UNDO_데이터파일_손상_—_리두_없음.md"
                    },
                    {
                        "title": "NOARC_UNDO_데이터파일_손상_—_리두_있음",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_UNDO_데이터파일_손상_—_리두_있음.md"
                    },
                    {
                        "title": "NOARC_read_only_테이블스페이스_손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_read_only_테이블스페이스_손상.md"
                    },
                    {
                        "title": "NOARC_디스크_전체_손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_디스크_전체_손상.md"
                    },
                    {
                        "title": "NOARC_리두_로그가_빠진_백업본으로_복구",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리두_로그가_빠진_백업본으로_복구.md"
                    },
                    {
                        "title": "NOARC_리커버리_데이터파일_손상_noarchive_&_no_redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리커버리_데이터파일_손상_noarchive_&_no_redo.md"
                    },
                    {
                        "title": "NOARC_리커버리_데이터파일_손상_noarchive_&_redo",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_리커버리_데이터파일_손상_noarchive_&_redo.md"
                    },
                    {
                        "title": "NOARC_컨트롤파일_전체_손상_—_Binary_백업본으로_복구",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_컨트롤파일_전체_손상_—_Binary_백업본으로_복구.md"
                    },
                    {
                        "title": "NOARC_컨트롤파일_전체_손상_—_trace로_재생성",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_컨트롤파일_전체_손상_—_trace로_재생성.md"
                    },
                    {
                        "title": "NOARC_트랜잭션_진행_중_UNDO_손상",
                        "url": "./skills/03.NOARCHIVE MODE/NOARC_트랜잭션_진행_중_UNDO_손상.md"
                    }
                ]
            },
            {
                "title": "RMAN",
                "icon": "fas fa-folder-open text-gray-400",
                "files": [
                    {
                        "title": "Block_Change_Tracking_활성화와_효과_확인",
                        "url": "./skills/04.RMAN/Block_Change_Tracking_활성화와_효과_확인.md"
                    },
                    {
                        "title": "CONFIGURE_영구_설정과_SHOW_ALL_확인",
                        "url": "./skills/04.RMAN/CONFIGURE_영구_설정과_SHOW_ALL_확인.md"
                    },
                    {
                        "title": "Image_Copy(BACKUP_AS_COPY)와_SWITCH를_이용한_즉시_복구",
                        "url": "./skills/04.RMAN/Image_Copy(BACKUP_AS_COPY)와_SWITCH를_이용한_즉시_복구.md"
                    },
                    {
                        "title": "LIST_REPORT_조회와_CROSSCHECK",
                        "url": "./skills/04.RMAN/LIST_REPORT_조회와_CROSSCHECK.md"
                    },
                    {
                        "title": "RESYNC_CATALOG와_Stored_Script_등록·실행",
                        "url": "./skills/04.RMAN/RESYNC_CATALOG와_Stored_Script_등록·실행.md"
                    },
                    {
                        "title": "RMAN_백업_암호화_SET_ENCRYPTION_ON",
                        "url": "./skills/04.RMAN/RMAN_백업_암호화_SET_ENCRYPTION_ON.md"
                    },
                    {
                        "title": "Retention_Policy_설정과_REPORT_DELETE_OBSOLETE",
                        "url": "./skills/04.RMAN/Retention_Policy_설정과_REPORT_DELETE_OBSOLETE.md"
                    },
                    {
                        "title": "SYSTEM_데이터파일_손상_복구",
                        "url": "./skills/04.RMAN/SYSTEM_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "UNDO_데이터파일_손상_복구",
                        "url": "./skills/04.RMAN/UNDO_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "데이터파일_유실_복구_RESTORE__RECOVER",
                        "url": "./skills/04.RMAN/데이터파일_유실_복구_RESTORE__RECOVER.md"
                    },
                    {
                        "title": "모든_데이터파일_손상_복구",
                        "url": "./skills/04.RMAN/모든_데이터파일_손상_복구.md"
                    },
                    {
                        "title": "모든_데이터파일을_새_위치로_복구",
                        "url": "./skills/04.RMAN/모든_데이터파일을_새_위치로_복구.md"
                    },
                    {
                        "title": "백업받지_않은_테이블스페이스의_데이터파일_복구_V",
                        "url": "./skills/04.RMAN/백업받지_않은_테이블스페이스의_데이터파일_복구_V.md"
                    },
                    {
                        "title": "압축_백업과_백업_조각_크기_조정",
                        "url": "./skills/04.RMAN/압축_백업과_백업_조각_크기_조정.md"
                    },
                    {
                        "title": "일반_테이블스페이스를_다른_위치로_복구_—_SET_NEWNAME__SWITCH",
                        "url": "./skills/04.RMAN/일반_테이블스페이스를_다른_위치로_복구_—_SET_NEWNAME__SWITCH.md"
                    },
                    {
                        "title": "증분_백업_Level_0&1_누적과_차등_비교",
                        "url": "./skills/04.RMAN/증분_백업_Level_0&1_누적과_차등_비교.md"
                    },
                    {
                        "title": "컨트롤파일_손상_복구_카탈로그와_자동_백업",
                        "url": "./skills/04.RMAN/컨트롤파일_손상_복구_카탈로그와_자동_백업.md"
                    },
                    {
                        "title": "테이블스페이스·데이터파일_단위_백업",
                        "url": "./skills/04.RMAN/테이블스페이스·데이터파일_단위_백업.md"
                    }
                ]
            }
        ]
    }
];