# 🧑‍💻 Oracle DBA Portfolio - 권오승

> **"전문성을 바탕으로 유연하게 소통하는 파트너"** <br>
> 시스템의 뼈대를 이해하고 성능 최적화를 고민하는 예비 Oracle DBA 권오승의 웹 포트폴리오입니다.

[![Web Site](https://img.shields.io/badge/🚀_포트폴리오_보러가기-000000?style=for-the-badge&logo=github&logoColor=white)](https://goonos.github.io/test3)
[![Blog](https://img.shields.io/badge/📝_네이버_블로그-03C75A?style=for-the-badge&logo=naver&logoColor=white)](https://blog.naver.com/10soong)

<br/>

## 📸 Preview
<!-- 💡 팁: 포트폴리오 메인 화면을 캡처해서 여기에 이미지로 넣으면 훨씬 멋집니다! -->
<!-- 예시: ![포트폴리오 프리뷰](이미지 주소) -->
> *(여기에 포트폴리오 사이트 메인 화면 캡처본을 추가해 주세요)*

<br/>

## 🎯 Key Features (포트폴리오 주요 구성)

본 포트폴리오 웹사이트는 단순히 이력서를 나열한 것이 아닌, **DBA로서의 실무 역량과 학습 과정**을 시각적으로 구현한 사이트입니다.

1. **🛠 Troubleshooting Experience**
   * 대용량 결제 테이블의 쿼리 타임아웃 발생 원인 분석(AWR, EXPLAIN PLAN) 및 인덱스 재구성을 통한 성능 튜닝 경험 기록.
   * `Highlight.js`를 적용하여 튜닝 전/후의 SQL 쿼리를 가독성 높게 제공.

2. **🏗 Zero-Downtime Architecture**
   * 안정성(Stability), 가용성(Availability), 생존성(Resilience), 확장성(Scalability) 4가지 핵심 가치를 기반으로 한 엔터프라이즈 DB 표준 환경 설계 백서.
   * Data Guard, RAC, RMAN, Exadata 등 핵심 아키텍처 정리.

3. **📚 Daily Log & Quiz Archive**
   * **Daily Log**: Oracle, Linux, Python 학습 기록과 블로그 원문 링크 제공.
   * **Quiz Archive**: 깃허브 Raw API와 `sql-formatter`를 연동하여, 저장소에 업로드된 SQL 실습 문제(Markdown)와 작성 쿼리(SQL)를 웹에서 실시간으로 불러와 동적으로 렌더링하는 기능 구현.

<br/>

## 🛠 Tech Stack (포트폴리오 개발 기술)

순수 프론트엔드 기술과 외부 라이브러리를 조합하여 정적(Static)이지만 동적인 UI를 구현했습니다.

* **Core**: `HTML5`, `Vanilla JavaScript`
* **Styling**: `Tailwind CSS (CDN)`
* **Icon & Font**: `FontAwesome 6.4`
* **Syntax Highlighting**: `Highlight.js`, `sql-formatter`
* **Deployment**: `GitHub Pages`

<br/>

## 📂 Directory Structure

```text
📦 Portfolio_Repository
 ┣ 📜 index.html    # 메인 HTML 및 UI 뼈대
 ┣ 📜 style.css     # Tailwind CSS 설정 및 커스텀 스타일링
 ┣ 📜 script.js     # 모달 제어, 슬라이더 애니메이션, Github API 비동기 통신 로직
 ┣ 📜 data.js       # 포트폴리오 데이터(Troubleshooting, Architecture, Log) 관리
 ┣ 📜 queries.js    # 트러블슈팅 관련 상세 SQL 쿼리문 데이터
 ┣ 📂 image/        # 갤러리 및 프로필 이미지 리소스
 ┗ 📂 quizzes/      # SQL 실습 문제 마크다운 및 정답 SQL 스크립트 (동적 로딩용)
