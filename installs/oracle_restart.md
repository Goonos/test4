```
# 🛠️ Oracle 19c Grid Infrastructure (ASM) & Restart 구성

단일 인스턴스(Single Instance) 파일 시스템의 I/O 병목 한계를 극복하고, 
훗날 RAC(Real Application Clusters) 환경으로의 확장성을 확보하기 위해 
ASM(Automatic Storage Management) 및 Oracle Restart를 직접 구성한 기록입니다.

### 📌 아키텍처 환경 스펙
* OS: Oracle Linux 7.9
* DB Version: Oracle 19c Grid Infrastructure for a Standalone Server
* 핵심 기술 요소:
  - 역할 기반 계정 분리 (grid / oracle)
  - oracleasm 기반 ASM 디스크 생성 및 디스크 그룹(+DATA, +FRA) 스토리지 가상화

---

### 📝 상세 구축 과정 및 트러블슈팅
설치 과정의 상세한 GUI 캡처 화면과 과정은 내용이 방대하여 
기술 블로그(Naver Blog)에 아카이빙해 두었습니다. 

아래 버튼을 클릭하시면 캡처 화면이 포함된 상세 가이드로 이동합니다.
```
<br>
<div align="center">
  <a href="https://blog.naver.com/10soong/224378811817" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background-color: #03c75a; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);">
    <i class="fas fa-external-link-alt"></i> 네이버 블로그 가이드 바로가기
  </a>
</div>