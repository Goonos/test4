import os
import re
import json

# 최상위 폴더 및 출력 파일 설정
base_dir = './skills'
output_file = 'auto_skills_data.js'

def main():
    if not os.path.exists(base_dir):
        print(f"❌ 오류: '{base_dir}' 경로를 찾을 수 없습니다.")
        return

    print("🔍 파일을 탐색하며 파일명 변경 및 데이터를 추출합니다...\n")
    
    # 최상위 구조 템플릿
    root_category = {
        "title": "BACKUP & RECOVERY",
        "icon": "fas fa-database text-red-400",
        "children": []
    }

    # 하위 폴더 목록 가져오기 및 정렬
    sub_folders = sorted([f for f in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, f))])

    for sub in sub_folders:
        # 폴더명 정제 (예: '01.BACKUP' -> 'BACKUP')
        clean_title = re.sub(r'^\d+[\._]\s*', '', sub).replace('_', ' ')
        
        # 카테고리별 맞춤 아이콘 자동 배정
        icon = "fas fa-folder text-blue-400"
        if "BACKUP" in sub.upper():
            icon = "fas fa-hdd text-emerald-400"
        elif "NOARCHIVE" in sub.upper():
            icon = "fas fa-box-open text-gray-400"
        elif "ARCHIVE" in sub.upper():
            icon = "fas fa-archive text-yellow-400"
        elif "RMAN" in sub.upper():
            icon = "fas fa-shield-alt text-green-400"

        sub_obj = {
            "title": clean_title,
            "icon": icon,
            "files": []
        }

        sub_path = os.path.join(base_dir, sub)
        # 마크다운 파일 목록 가져오기 및 정렬
        md_files = sorted([f for f in os.listdir(sub_path) if f.endswith('.md')])

        for file in md_files:
            # 1. 파일명에서 공백 2개를 1개로 수정
            processed_name = re.sub(r'\s{2,}', ' ', file)
            # 2. 남은 모든 공백을 '_'로 수정
            processed_name = processed_name.replace(' ', '_')
            
            # '___' 기준으로 파일명 분리
            if '___' in processed_name:
                parts = processed_name.split('___', 1)
                prefix = parts[0]  # 예: 13_4
                
                # '___' 뒤의 텍스트를 title로 추출 (.md 제거)
                title_text = parts[1].replace('.md', '')
                
                # 💡 [요청사항 반영] 실제 변경될 파일명은 앞의 숫자.md 형태로 고정
                new_filename = f"{prefix}.md"
            else:
                # 혹시 '___'가 없는 파일이 섞여 있을 경우를 위한 방어 로직
                title_text = processed_name.replace('.md', '')
                new_filename = processed_name

            # 💡 [요청사항 반영] URL은 변경된 짧은 파일명(예: 13_4.md)으로 세팅
            url_text = f"/test4/skills/{sub}/{new_filename}"

            sub_obj["files"].append({
                "title": title_text,
                "url": url_text
            })

            # 3. 실제 물리적 파일 이름 강제 변경
            old_path = os.path.join(sub_path, file)
            new_path = os.path.join(sub_path, new_filename)
            
            if old_path != new_path:
                try:
                    os.rename(old_path, new_path)
                    print(f"   📄 파일명 변경: '{file}' ➡️ '{new_filename}'")
                except Exception as e:
                    print(f"   ❌ 변경 실패: '{file}' ({e})")

        # 파일이 존재하는 폴더만 카테고리에 추가
        if len(sub_obj["files"]) > 0:
            root_category["children"].append(sub_obj)

    # 4. 자바스크립트 파일로 저장
    js_content = (
        "// ⚠️ 이 파일은 자동 생성 스크립트에 의해 만들어졌습니다.\n\n"
        f"const AUTO_SKILLS_DATA = {json.dumps(root_category, ensure_ascii=False, indent=4)};\n\n"
        "export default AUTO_SKILLS_DATA;"
    )
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\n✅ 완료! [{output_file}] 파일이 생성되었으며 물리적 파일명 수정도 완벽하게 적용되었습니다!")

if __name__ == '__main__':
    main()