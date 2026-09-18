import os

# 최상위 폴더 경로 설정
base_dir = './skills/'

# 경로가 존재하는지 확인
if not os.path.exists(base_dir):
    print(f"오류: '{base_dir}' 경로를 찾을 수 없습니다.")
else:
    # 하위 디렉토리 및 파일 탐색
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            # 파일 이름에 공백이 있는지 확인
            if ' ' in file:
                # 기존 파일의 전체 경로
                old_file_path = os.path.join(root, file)
                
                # 공백을 '_'로 치환한 새로운 파일 이름 생성
                new_file_name = file.replace(' ', '_')
                
                # 새로운 파일의 전체 경로
                new_file_path = os.path.join(root, new_file_name)
                
                # 파일 이름 변경 실행
                os.rename(old_file_path, new_file_path)
                print(f"이름 변경됨: '{file}' -> '{new_file_name}'")
                
    print("모든 작업이 완료되었습니다.")