const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'skills');
const skillsData = [];

// 1. 최상위 대분류 카테고리를 하나 만듭니다. (이름은 자유롭게 변경 가능)
const rootCategory = {
    title: "ORACLE DBA SKILLS",
    icon: "fas fa-database text-blue-400",
    children: []
};

try {
    // 2. skills 폴더 안의 하위 폴더들 (01.BAKCUP, 02.ARCHIVE MODE 등) 읽기
    const subFolders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

    // 폴더 이름 순서대로 정렬 (01, 02, 03...)
    subFolders.sort();

    subFolders.forEach(sub => {
        // 정규식으로 "03. NOARCHIVE MODE" 에서 "03. " 부분을 제거해 깔끔한 타이틀 생성
        const cleanTitle = sub.replace(/^\d+\.\s*/, ''); 

        const subObj = {
            title: cleanTitle, // 예: "NOARCHIVE MODE"
            icon: "fas fa-folder-open text-gray-400",
            files: []
        };

        const subPath = path.join(baseDir, sub);
        
        // 3. 해당 폴더 안의 .md 파일들 읽기
        const mdFiles = fs.readdirSync(subPath).filter(f => f.endsWith('.md'));

        mdFiles.forEach(file => {
            subObj.files.push({
                title: file.replace('.md', ''), // 확장자를 제거한 파일명
                // URL은 실제 접속해야 하므로 원본 폴더명(sub)과 파일명을 그대로 사용합니다.
                url: `./skills/${sub}/${file}` 
            });
        });

        // 파일이 1개라도 있는 폴더만 추가
        if (subObj.files.length > 0) {
            rootCategory.children.push(subObj);
        }
    });

    // 완성된 데이터를 배열에 담기
    if (rootCategory.children.length > 0) {
        skillsData.push(rootCategory);
    }

    // 자바스크립트 파일 형태로 저장
    const jsContent = `// ⚠️ 이 파일은 generate_skills.js에 의해 자동 생성됩니다. 직접 수정하지 마세요.\n\nconst AUTO_SKILLS_DATA = ${JSON.stringify(skillsData, null, 4)};`;
    
    fs.writeFileSync(path.join(__dirname, 'auto_skills.js'), jsContent);
    console.log("✅ auto_skills.js 파일이 현재 폴더 구조에 맞춰 성공적으로 생성되었습니다!");

} catch (error) {
    console.error("❌ 폴더를 읽는 중 에러가 발생했습니다. skills 폴더가 존재하는지 확인해주세요.", error);
}