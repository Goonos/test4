document.addEventListener("DOMContentLoaded", () => {
// ==========================================
// 💡 새로운 Skills (위키형 뷰어) 제어 모듈
// ==========================================
try {
    const skillsTree = document.getElementById("skills-tree");
    const skillsContent = document.getElementById("markdown-viewer");
    const skillsPlaceholder = document.getElementById("skills-placeholder");
    const skillsBreadcrumb = document.getElementById("skills-breadcrumb");

    if (skillsTree && DATA.skills) {
        let treeHtml = `<ul class="space-y-1">`;
        
        DATA.skills.forEach((category, catIdx) => {
            // 💡 [요구사항 반영] 1단계 대분류 (SQL, BACKUP & RECOVERY)는 기본적으로 열려있도록 설정 (max-height: 2000px, 아이콘 뒤집기)
            treeHtml += `
                <li>
                    <button class="w-full text-left px-2 py-2 flex items-center justify-between text-gray-300 hover:bg-gray-800 rounded-md transition cursor-pointer" onclick="toggleTree('cat-${catIdx}')">
                        <span class="font-bold text-xs"><i class="${category.icon} w-5 text-center mr-1"></i> ${category.title}</span>
                        <i id="icon-cat-${catIdx}" class="fas fa-chevron-down text-[10px] text-gray-500 transition-transform" style="transform: rotate(-180deg);"></i>
                    </button>
                    <ul id="cat-${catIdx}" class="pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300" style="max-height: 2000px;">
            `;
            
            if(category.children) {
                category.children.forEach((sub, subIdx) => {
                    const subId = `sub-${catIdx}-${subIdx}`;
                    // 💡 [요구사항 반영] 2단계 소분류 (PRACTICE, ARCHIVE MODE 등)는 닫혀있도록 설정 (max-height: 0px)
                    treeHtml += `
                        <li>
                            <button class="w-full text-left px-2 py-1.5 flex items-center justify-between text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-md transition cursor-pointer" onclick="toggleTree('${subId}')">
                                <span class="text-xs font-semibold"><i class="${sub.icon} w-5 text-center mr-1"></i> ${sub.title}</span>
                                <i id="icon-${subId}" class="fas fa-chevron-down text-[10px] text-gray-600 transition-transform"></i>
                            </button>
                            <ul id="${subId}" class="pl-5 mt-1 space-y-0.5 overflow-hidden transition-all duration-300" style="max-height: 0px;">
                    `;
                    
                    if(sub.files) {
                        sub.files.forEach((file, fileIdx) => {
                            const bcPath = `${category.title} > ${sub.title} > ${file.title}`;
                            const fileJson = JSON.stringify(file).replace(/"/g, '&quot;');
                            // 프로젝트 파일일 경우 아이콘을 다르게 표시
                            const fileIcon = file.isProject ? 'fas fa-project-diagram text-purple-400' : 'fas fa-file-alt opacity-70';
                            
                            treeHtml += `
                                <li>
                                    <button class="file-btn w-full text-left px-2 py-1.5 text-xs text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition cursor-pointer flex items-start" onclick="loadSkillDoc('${file.url}', this, '${bcPath}', '${fileJson}')">
                                        <i class="${fileIcon} mt-0.5 mr-2 w-3 text-center"></i> <span class="line-clamp-1 break-all">${file.title}</span>
                                    </button>
                                </li>
                            `;
                        });
                    }
                    treeHtml += `</ul></li>`;
                });
            }
            treeHtml += `</ul></li>`;
        });
        treeHtml += `</ul>`;
        skillsTree.innerHTML = treeHtml;
    }

    window.toggleTree = function(id) {
        const el = document.getElementById(id);
        const icon = document.getElementById(`icon-${id}`);
        if (!el) return;
        
        if (el.style.maxHeight && el.style.maxHeight !== "0px") {
            el.style.maxHeight = "0px";
            if(icon) icon.style.transform = "rotate(0deg)";
        } else {
            el.style.maxHeight = el.scrollHeight + "1000px";
            if(icon) icon.style.transform = "rotate(-180deg)";
        }
    };

    // 문서, 퀴즈, 미니 프로젝트 로드 함수
    window.loadSkillDoc = async function(url, btnElement, pathStr, fileDataStr) {
        const fileData = JSON.parse(fileDataStr.replace(/&quot;/g, '"'));

        document.querySelectorAll('.file-btn').forEach(btn => {
            btn.classList.remove('bg-blue-500/10', 'text-blue-400');
            btn.classList.add('text-gray-500');
        });
        btnElement.classList.add('bg-blue-500/10', 'text-blue-400');
        btnElement.classList.remove('text-gray-500');

        skillsBreadcrumb.innerHTML = `<i class="fas fa-folder-open text-blue-400 mr-2"></i> ${pathStr}`;
        skillsPlaceholder.classList.add("hidden");
        skillsContent.classList.remove("hidden");
        
        // 💡 1. 미니 프로젝트인 경우 (모달창 연동)
        if (fileData.isProject) {
            skillsContent.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400 mt-10">
                    <div class="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-5 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                        <i class="fas fa-project-diagram text-2xl text-purple-400"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-2">${fileData.title}</h3>
                    <p class="text-xs text-gray-500 mb-6 text-center break-keep">이 프로젝트는 화면 분할(명세서 + SQL 해답)에 최적화된 팝업 창에서 제공됩니다.</p>
                    <button onclick="window.openProjectModal('${fileData.projectId}')" class="px-5 py-2 bg-purple-600/90 hover:bg-purple-500 border border-purple-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-purple-500/20">
                        <i class="fas fa-external-link-alt"></i> 프로젝트 모달창 다시 열기
                    </button>
                </div>
            `;
            // 클릭과 동시에 모달창을 즉시 띄워주는 편의성 제공
            window.openProjectModal(fileData.projectId);
            return; // 마크다운 파싱을 하지 않고 여기서 함수 종료
        }

        // 로딩 UI
        skillsContent.innerHTML = `
            <div class="flex flex-col items-center justify-center h-40 text-blue-400">
                <i class="fas fa-spinner fa-spin text-2xl mb-3"></i>
                <p class="text-xs">데이터를 불러오는 중입니다...</p>
            </div>
        `;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("데이터를 찾을 수 없습니다.");
            const mdText = await response.text();
            
            // 💡 2. 퀴즈 문서인 경우 (기존 파서 연동)
            if (fileData.isQuiz) {
                const guideBox = fileData.guide ? `
                    <div class="bg-gray-900 p-4 rounded-xl border border-gray-800 text-xs text-gray-400 leading-relaxed mb-6">
                        <strong>🛠️ 실습 환경</strong><br>
                        - ${fileData.guide}<br>
                        - 각 문항 하단의 <span class="text-blue-400 font-bold">[작성 SQL 보기]</span> 단추를 클릭하면 작성했던 답안을 펼쳐줍니다.
                    </div>
                ` : '';

                let htmlContent = `<div class="wiki-format space-y-6">${guideBox}<div class="space-y-4">`;
                const problems = mdText.split(/^\s*---\s*$/m);

                problems.forEach(problem => {
                    const text = problem.trim();
                    if (!text) return;

                    const numMatch = text.match(/\[(\d+)번\]/);
                    if (!numMatch) return;
                    const qNum = numMatch[1];

                    const codeMatch = text.match(/```([\s\S]*?)```/);
                    const codeContent = codeMatch ? codeMatch[1].trim() : '';

                    let qText = codeMatch ? text.split('```')[0].replace(/\[\d+번\]\s*/, '').trim() : text.replace(/\[\d+번\]\s*/, '').trim();
                    qText = qText.replace(/\*\*/g, '').replace(/\n/g, '<br>');

                    const paddedNum = String(qNum).padStart(2, '0');
                    const fileName = `${fileData.prefix}_${paddedNum}.sql`;
                    const rawFileUrl = `./quizzes/answers/${fileName}`; 

                    htmlContent += `
                        <div class="pb-5 border-b border-gray-800/50">
                            <h4 class="text-white font-bold mb-3 text-sm md:text-base leading-relaxed"><span class="text-blue-400 mr-1">[Q${qNum}]</span> ${qText}</h4>
                            
                            ${codeContent ? `
                            <div class="bg-gray-900 rounded-lg p-3 mb-4 border border-gray-800 overflow-x-auto">
                                <span class="block text-[10px] text-gray-500 font-mono mb-2">💡 예상 실행 결과</span>
                                <pre class="!bg-transparent !border-none !p-0 !m-0"><code class="text-[10px] md:text-xs text-gray-300 font-mono whitespace-pre">${codeContent}</code></pre>
                            </div>
                            ` : ''}
                            
                            <div class="flex flex-col gap-3 mt-2">
                                <div class="flex justify-start">
                                    <button onclick="toggleAnswerCode('${rawFileUrl}', 'ans-${fileData.quizId}-${qNum}')" class="px-3 py-1.5 bg-gray-800 text-gray-300 border border-gray-700 text-xs font-medium rounded-md hover:bg-gray-700 cursor-pointer transition-all flex items-center gap-1.5">
                                        <i class="fas fa-code text-blue-400"></i> 작성 SQL 보기
                                    </button>
                                </div>
                                
                                <div id="ans-${fileData.quizId}-${qNum}" class="hidden w-full bg-black border border-gray-800 rounded-lg p-4 overflow-x-auto">
                                    <pre class="!bg-transparent !border-none !p-0 !m-0"><code class="language-sql">로딩 중...</code></pre>
                                </div>
                            </div>
                        </div>
                    `;
                });
                htmlContent += `</div></div>`;
                skillsContent.innerHTML = htmlContent;

            // 💡 3. 일반 마크다운 문서인 경우
            } else {
                const htmlContent = marked.parse(mdText);
                skillsContent.innerHTML = `<div class="wiki-format">${htmlContent}</div>`;
                
                setTimeout(() => {
                    if (typeof hljs !== 'undefined') {
                        skillsContent.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });
                    }
                }, 50);
            }

        } catch (error) {
            skillsContent.innerHTML = `
                <div class="text-red-400 p-6 bg-red-500/10 rounded-lg border border-red-500/20">
                    <i class="fas fa-exclamation-triangle mr-2"></i> 데이터를 불러오지 못했습니다. <br>
                    <span class="text-xs text-gray-500 mt-2 block">경로: ${url}</span>
                </div>
            `;
        }
    };
} catch (e) {
    console.error("Skills Tree Error:", e);
}
    
    // ==========================================
    // 💡 아키텍처 팝업 모달 제어 함수 (확장 애니메이션 적용)
    // ==========================================
    const archModal = document.getElementById("arch-modal");
    const archModalContent = document.getElementById("arch-modal-content");
    const archModalCloseBtn = document.getElementById("arch-modal-close");
    const archModalTitle = document.getElementById("arch-modal-title");
    const archModalBody = document.getElementById("arch-modal-body");
    const archModalIcon = document.getElementById("arch-modal-icon");

    window.openArchModal = function(archId) {
        if (!DATA.architecture) return;
        const arch = DATA.architecture.find(a => a.id === archId);
        if (!arch) return;

        // 1. 모달 내부 데이터 주입
        if (archModalTitle) archModalTitle.innerText = arch.title;
        if (archModalBody) archModalBody.innerHTML = arch.content;
        if (archModalIcon && arch.icon) {
            archModalIcon.className = arch.icon + " text-blue-400 text-lg";
        }

        // 2. 모달 열기 & 확장 애니메이션 적용
        if (archModal) {
            archModal.classList.remove("hidden");
            void archModal.offsetWidth; 
            archModal.classList.remove("opacity-0", "pointer-events-none");
            archModal.classList.add("flex");
            
            if (archModalContent) {
                archModalContent.classList.remove("scale-95");
                archModalContent.classList.add("scale-100");
            }
            
            document.body.style.overflow = "hidden";
        }

        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('#arch-modal-body pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    };

    window.closeArchModal = function() {
        if (archModal) {
            archModal.classList.add("opacity-0", "pointer-events-none");
            if (archModalContent) {
                archModalContent.classList.remove("scale-100");
                archModalContent.classList.add("scale-95");
            }
            
            setTimeout(() => {
                archModal.classList.add("hidden");
                archModal.classList.remove("flex");
                document.body.style.overflow = "";
                if (archModalBody) archModalBody.innerHTML = "";
            }, 300);
        }
    };

    if (archModalCloseBtn) {
        archModalCloseBtn.addEventListener("click", window.closeArchModal);
    }
    if (archModal) {
        archModal.addEventListener("click", (e) => {
            if (e.target === archModal) {
                window.closeArchModal();
            }
        });
    }
    
    // ==========================================
    // 1. 트러블슈팅 섹션
    // ==========================================

    /*

    try {
        const troubleContainer = document.getElementById("trouble-container");
        const troubleIndicator = document.getElementById("trouble-indicator");
        const troubleIndicatorMobile = document.getElementById("trouble-indicator-mobile");
        
        if (troubleContainer && DATA.troubleshooting && DATA.troubleshooting.length > 0) {
            const tItemsPerPage = 1; 
            const tTotalItems = DATA.troubleshooting.length;
            const tTotalPages = Math.ceil(tTotalItems / tItemsPerPage);
            let tCurrentPage = 0;

            troubleContainer.innerHTML = ""; 
            troubleContainer.style.perspective = "1200px";
            troubleContainer.style.transformStyle = "preserve-3d";
            troubleContainer.className = "relative w-full transition-all duration-500 ease-in-out";

            for (let i = 0; i < tTotalPages; i++) {
                const item = DATA.troubleshooting[i];
                if (!item) continue;
                
                let detailsHtml = "";
                if (item.details && item.details.length > 0) {
                    item.details.forEach(det => {
                        detailsHtml += `
                            <div class="mt-4 border-t border-gray-800/80 pt-4">
                                <h4 class="text-xs md:text-sm font-bold text-blue-400 mb-1.5">${det.subtitle}</h4>
                                <p class="text-gray-400 text-xs md:text-sm leading-relaxed">${det.content}</p>
                            </div>
                        `;
                    });
                }

                let phtml = `
                    <div id="trouble-card-${i}" class="trouble-card absolute inset-x-0 mx-auto w-[92%] md:w-[76%] transition-all duration-500 ease-in-out origin-center select-none" style="opacity: 0; pointer-events: none; backface-visibility: hidden;">
                        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 md:p-6 w-full min-w-0 overflow-hidden flex flex-col shadow-2xl">
                            <h3 class="text-lg md:text-xl font-bold text-white mb-4 flex flex-col md:flex-row md:items-center gap-2 items-start w-full min-w-0">
                                <span class="text-[10px] md:text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-mono font-normal whitespace-nowrap shrink-0">Issue</span> 
                                <span class="leading-snug break-all">${item.title}</span>
                            </h3>
                            
                            <div class="flex flex-col gap-4 md:gap-5 text-xs md:text-sm leading-relaxed text-gray-300 w-full min-w-0">
                                <p class="m-0"><strong class="text-blue-400">🚨 현상 (Context):</strong><br>${item.context}</p>
                                <p class="m-0"><strong class="text-emerald-400">📈 결과 (Result):</strong><br>${item.result}</p>
                                
                                <div class="min-w-0 w-full flex flex-col m-0">
                                    <strong class="text-purple-400 block mb-2">💻 수정된 쿼리:</strong>
                                    <div id="code-wrapper-${item.id}" class="relative w-full rounded-lg bg-gray-950 border border-gray-800 overflow-hidden transition-all duration-500 ease-in-out [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-950 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500" style="max-height: 160px;">
                                        <pre class="w-full max-w-full block p-4 pb-12 text-[10px] md:text-xs font-mono [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"><code class="language-sql">${item.code}</code></pre>
                                        <div id="code-fade-${item.id}" class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none transition-opacity duration-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div id="details-${item.id}" class="max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                                <div class="py-2">
                                    ${detailsHtml}
                                </div>
                            </div>

                            <div class="mt-4 pt-4 border-t border-gray-800/40 flex justify-end">
                                <button data-target="details-${item.id}" class="toggle-detail-btn text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md border border-gray-700 transition inline-flex items-center gap-1 cursor-pointer">
                                    <span>자세히 보기</span> <i class="fas fa-chevron-down text-[10px] transition-transform duration-300"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                troubleContainer.innerHTML += phtml;
            }

            function closeAllDetails() {
                document.querySelectorAll(".toggle-detail-btn").forEach(btn => {
                    const targetId = btn.getAttribute("data-target");
                    const targetEl = document.getElementById(targetId);
                    if (!targetEl) return;
                    
                    const codeId = targetId.replace("details-", "");
                    const codeWrapper = document.getElementById(`code-wrapper-${codeId}`);
                    const codeFade = document.getElementById(`code-fade-${codeId}`);
                    const icon = btn.querySelector("i");
                    const btnText = btn.querySelector("span");

                    if (targetEl.style.maxHeight !== "" && targetEl.style.maxHeight !== "0px") {
                        targetEl.style.maxHeight = "0px";
                        
                        if (codeWrapper) {
                            codeWrapper.style.maxHeight = "160px";
                            codeWrapper.classList.remove("overflow-y-auto");
                            codeWrapper.classList.add("overflow-hidden");
                            codeWrapper.scrollTop = 0; 
                        }
                        if (codeFade) codeFade.style.opacity = "1";
                        if (icon) icon.style.transform = "rotate(0deg)";
                        if (btnText) btnText.innerText = "자세히 보기";
                        btn.classList.remove("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                    }
                });
            }

            function updateTroubleSlider() {
                closeAllDetails(); 

                const cards = troubleContainer.querySelectorAll(".trouble-card");
                cards.forEach((card, idx) => {
                    let distance = idx - tCurrentPage;
                    
                    if (tTotalPages > 2) {
                        if (distance > tTotalPages / 2) distance -= tTotalPages;
                        else if (distance < -tTotalPages / 2) distance += tTotalPages;
                    } else if (tTotalPages === 2) {
                        if (tCurrentPage === 0 && idx === 1) distance = 1;
                        if (tCurrentPage === 1 && idx === 0) distance = -1;
                    }
                    
                    if (distance === 0) {
                        card.style.transform = "translate3d(0, 0, 0) rotateY(0deg) scale(1)";
                        card.style.opacity = "1";
                        card.style.zIndex = "10";
                        card.style.filter = "none";
                        card.style.pointerEvents = "auto";
                    } else if (distance === -1) {
                        card.style.transform = "translate3d(-24%, 0, -180px) rotateY(28deg) scale(0.85)";
                        card.style.opacity = "0.35";
                        card.style.zIndex = "5";
                        card.style.filter = "blur(1.5px)";
                        card.style.pointerEvents = "none";
                    } else if (distance === 1) {
                        card.style.transform = "translate3d(24%, 0, -180px) rotateY(-28deg) scale(0.85)";
                        card.style.opacity = "0.35";
                        card.style.zIndex = "5";
                        card.style.filter = "blur(1.5px)";
                        card.style.pointerEvents = "none";
                    } else {
                        const side = distance > 0 ? 1 : -1;
                        card.style.transform = `translate3d(${side * 45}%, 0, -350px) rotateY(${-side * 45}deg) scale(0.7)`;
                        card.style.opacity = "0";
                        card.style.zIndex = "1";
                        card.style.filter = "blur(4px)";
                        card.style.pointerEvents = "none";
                    }
                });

                setTimeout(() => {
                    const activeCard = troubleContainer.children[tCurrentPage];
                    if (activeCard) {
                        troubleContainer.style.height = activeCard.offsetHeight + "px";
                    }
                }, 60);
                
                const indicatorText = `Page ${tCurrentPage + 1} / ${tTotalPages}`;
                if (troubleIndicator) troubleIndicator.innerText = indicatorText;
                if (troubleIndicatorMobile) troubleIndicatorMobile.innerText = indicatorText;
            }

            const tPrevButtons = [document.getElementById("trouble-prev"), document.getElementById("trouble-prev-mobile")];
            const tNextButtons = [document.getElementById("trouble-next"), document.getElementById("trouble-next-mobile")];

            tPrevButtons.forEach(btn => {
                if (btn) btn.addEventListener("click", () => {
                    tCurrentPage = (tCurrentPage - 1 + tTotalPages) % tTotalPages;
                    updateTroubleSlider();
                });
            });

            tNextButtons.forEach(btn => {
                if (btn) btn.addEventListener("click", () => {
                    tCurrentPage = (tCurrentPage + 1) % tTotalPages;
                    updateTroubleSlider();
                });
            });

            updateTroubleSlider();

            document.querySelectorAll(".toggle-detail-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const currentBtn = e.currentTarget;
                    const targetId = currentBtn.getAttribute("data-target");
                    const targetEl = document.getElementById(targetId);
                    if (!targetEl) return;
                    
                    const codeId = targetId.replace("details-", "");
                    const codeWrapper = document.getElementById(`code-wrapper-${codeId}`);
                    const codeFade = document.getElementById(`code-fade-${codeId}`);
                    const icon = currentBtn.querySelector("i");
                    const btnText = currentBtn.querySelector("span");

                    if (targetEl.style.maxHeight === "" || targetEl.style.maxHeight === "0px") {
                        targetEl.style.maxHeight = targetEl.scrollHeight + "px";
                        if (codeWrapper) {
                            const maxExpandedHeight = 500; 
                            if (codeWrapper.scrollHeight > maxExpandedHeight) {
                                codeWrapper.style.maxHeight = maxExpandedHeight + "px";
                                codeWrapper.classList.remove("overflow-hidden");
                                codeWrapper.classList.add("overflow-y-auto");
                            } else {
                                codeWrapper.style.maxHeight = codeWrapper.scrollHeight + "px";
                            }
                        }
                        if (codeFade) codeFade.style.opacity = "0";
                        if (icon) icon.style.transform = "rotate(180deg)";
                        if (btnText) btnText.innerText = "접기";
                        currentBtn.classList.add("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                        
                        setTimeout(() => {
                            const activeCard = troubleContainer.children[tCurrentPage];
                            if (activeCard) troubleContainer.style.height = activeCard.offsetHeight + "px";
                        }, 510);
                    } else {
                        targetEl.style.maxHeight = "0px";
                        if (codeWrapper) {
                            codeWrapper.style.maxHeight = "160px";
                            codeWrapper.classList.remove("overflow-y-auto");
                            codeWrapper.classList.add("overflow-hidden");
                            codeWrapper.scrollTop = 0; 
                        }
                        if (codeFade) codeFade.style.opacity = "1";
                        if (icon) icon.style.transform = "rotate(0deg)";
                        if (btnText) btnText.innerText = "자세히 보기";
                        currentBtn.classList.remove("bg-blue-500/10", "text-blue-400", "border-blue-500/30");
                        
                        setTimeout(() => {
                            const activeCard = troubleContainer.children[tCurrentPage];
                            if (activeCard) troubleContainer.style.height = activeCard.offsetHeight + "px";
                        }, 510);
                    }
                });
            });
        }
    } catch (e) {
        console.error("Troubleshooting Error 예외 처리:", e);
    }
    */
   
    // ==========================================
    // 2. 아키텍처 섹션 (2x2 그리드)
    // ==========================================

    try {
        const quadContainer = document.getElementById("arch-quadrant-container");
        if (quadContainer && DATA.architecture) {
            let quadHtml = "";
            DATA.architecture.forEach((item, index) => {
                const tags = item.tags.map(t => `<span class="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">#${t}</span>`).join("");
                
                quadHtml += `
                    <div onclick="window.openArchModal('${item.id}')" class="arch-card w-full bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-gray-800 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col justify-between h-full min-h-[200px] md:min-h-[220px]">
                        <div class="absolute -inset-full bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition duration-500 blur-2xl z-0"></div>
                        <i class="${item.icon} absolute -bottom-4 -right-4 text-7xl md:text-[7rem] text-gray-800/20 group-hover:text-blue-500/5 transition duration-500 transform group-hover:scale-110 z-0"></i>
                        <div class="relative z-10">
                            <div class="arch-header flex items-center gap-3 md:gap-4 mb-4 pb-4 border-b border-gray-800/80 transition-all duration-300">
                                <div class="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition shadow-inner">
                                    <i class="${item.icon} text-lg text-blue-400"></i>
                                </div>
                                <div class="flex flex-col justify-center">
                                    <strong class="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-wide">${item.pillar}</strong>
                                </div>
                            </div>
                            <h3 class="arch-title text-sm md:text-base font-bold text-gray-200 mb-2 transition-all duration-300">${item.title}</h3>
                            <p class="arch-summary text-gray-400 text-xs md:text-sm leading-relaxed mb-5 transition-all duration-300">${item.summary}</p>
                            <div class="flex gap-1.5 flex-wrap">${tags}</div>
                        </div>
                    </div>
                `;
            });
            quadContainer.innerHTML = quadHtml;
        }
    } catch (e) {
        console.error("Architecture Quadrant Error:", e);
    }

    // ==========================================
    // 💡 3. 블로그, 퀴즈, 프로젝트 통합 멀티 슬라이더
    // ==========================================
    try {
        const blogContainer = document.getElementById("blog-container");
        const quizContainer = document.getElementById("quiz-container");
        const projectContainer = document.getElementById("project-container");
        const logIndicator = document.getElementById("log-indicator");
        const logIndicatorMobile = document.getElementById("log-indicator-mobile");
        
        const tabBlogBtn = document.getElementById("tab-blog");
        const tabQuizBtn = document.getElementById("tab-quiz");
        const tabProjectBtn = document.getElementById("tab-project");

        let currentMode = 'blog'; 
        let blogPage = 0;
        let quizPage = 0;
        let projectPage = 0;
        const itemsPerPage = 6;

        function initLogs() {
            // 1. 블로그 컨테이너 렌더링
            if (blogContainer && DATA.blogLogs) {
                blogContainer.innerHTML = "";
                const totalPages = Math.ceil(DATA.blogLogs.length / itemsPerPage);
                for (let i = 0; i < totalPages; i++) {
                    const chunk = DATA.blogLogs.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
                    let pageHtml = `<div class="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 box-border content-start">`;
                    chunk.forEach(item => {
                        const tagsHtml = item.tags.map(tag => `<span class="text-[10px] text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded font-mono">#${tag}</span>`).join(" ");
                        pageHtml += `
                            <div onclick="window.open('${item.link}', '_blank')" class="bg-gray-800/30 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:bg-gray-800/60 hover:border-blue-500/30 transition h-44 cursor-pointer group">
                                <div>
                                    <span class="text-[10px] text-gray-500 font-mono">${item.date}</span>
                                    <h3 class="text-sm font-bold text-white mt-1 mb-1.5 line-clamp-1 group-hover:text-blue-300 transition">${item.title}</h3>
                                    <p class="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">${item.summary}</p>
                                </div>
                                <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-800/50">
                                    <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                                    <span class="text-[10px] text-gray-400 group-hover:text-blue-400 font-medium shrink-0 ml-2 transition">열기 ↗</span>
                                </div>
                            </div>`;
                    });
                    pageHtml += `</div>`;
                    blogContainer.innerHTML += pageHtml;
                }
            }

            // 2. 퀴즈 아카이브 렌더링
            if (quizContainer && DATA.quizzes) {
                quizContainer.innerHTML = "";
                const totalPages = Math.ceil(DATA.quizzes.length / itemsPerPage);
                for (let i = 0; i < totalPages; i++) {
                    const chunk = DATA.quizzes.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
                    let pageHtml = `<div class="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 box-border content-start">`;
                    chunk.forEach(item => {
                        const tagsHtml = item.tags.map(tag => `<span class="text-[10px] text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded font-mono">#${tag}</span>`).join(" ");
                        pageHtml += `
                            <div onclick="window.openQuizModal('${item.id}')" class="bg-gray-800/20 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:bg-gray-800/60 hover:border-blue-500/30 transition h-44 cursor-pointer group">
                                <div>
                                    <span class="text-[10px] text-blue-400 font-mono font-bold">${item.chapter}</span> • <span class="text-[10px] text-gray-500 font-mono">${item.date}</span>
                                    <h3 class="text-sm font-bold text-white mt-1 mb-1.5 line-clamp-1 group-hover:text-blue-300 transition">${item.title}</h3>
                                    <p class="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">${item.summary}</p>
                                </div>
                                <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-800/50">
                                    <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                                    <span class="text-[10px] text-gray-400 group-hover:text-blue-400 font-medium">열기 ↗</span>
                                </div>
                            </div>`;
                    });
                    pageHtml += `</div>`;
                    quizContainer.innerHTML += pageHtml;
                }
            }

            // 3. 미니 프로젝트 렌더링
            if (projectContainer && DATA.miniProjects) {
                projectContainer.innerHTML = "";
                const totalPages = Math.ceil(DATA.miniProjects.length / itemsPerPage);
                for (let i = 0; i < totalPages; i++) {
                    const chunk = DATA.miniProjects.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
                    let pageHtml = `<div class="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-4 px-1 box-border content-start">`;
                    chunk.forEach(item => {
                        const tagsHtml = item.tags.map(tag => `<span class="text-[10px] text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded font-mono">#${tag}</span>`).join(" ");
                        pageHtml += `
    <div onclick="window.openProjectModal('${item.id}')" class="bg-gray-800/30 border border-gray-800 rounded-lg p-4 flex flex-col justify-between hover:bg-gray-800/60 hover:border-blue-500/30 transition h-44 cursor-pointer group">
        <div>
            <span class="text-[10px] text-blue-400 font-mono font-bold">PROJECT</span> • <span class="text-[10px] text-gray-500 font-mono">${item.date}</span>
            <h3 class="text-sm font-bold text-white mt-1 mb-1.5 line-clamp-1 group-hover:text-blue-300 transition">${item.title}</h3>
            <p class="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">${item.summary}</p>
        </div>
        <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-800/50">
            <div class="flex flex-wrap gap-1">${tagsHtml}</div>
            <span class="text-[10px] text-gray-400 group-hover:text-blue-400 font-medium shrink-0 ml-2 transition">열기 ↗</span>
        </div>
    </div>`;
                    });
                    pageHtml += `</div>`;
                    projectContainer.innerHTML += pageHtml; 
                }
            }
            
            updateLogSlider();
        }

        function updateLogSlider() {
            const isBlog = (currentMode === 'blog');
            const isQuiz = (currentMode === 'quiz');
            const isProject = (currentMode === 'project');

            if(blogContainer) blogContainer.classList.toggle("hidden", !isBlog);
            if(quizContainer) quizContainer.classList.toggle("hidden", !isQuiz);
            if(projectContainer) projectContainer.classList.toggle("hidden", !isProject);

            let activeContainer, targetPage, dataLength;
            
            if (isBlog) { activeContainer = blogContainer; targetPage = blogPage; dataLength = DATA.blogLogs?.length || 0; }
            else if (isQuiz) { activeContainer = quizContainer; targetPage = quizPage; dataLength = DATA.quizzes?.length || 0; }
            else { activeContainer = projectContainer; targetPage = projectPage; dataLength = DATA.miniProjects?.length || 0; }

            const totalPages = Math.max(Math.ceil(dataLength / itemsPerPage), 1);

            if (activeContainer) {
                activeContainer.style.transform = `translateX(-${targetPage * 100}%)`;
            }

            const text = `Page ${targetPage + 1} / ${totalPages}`;
            if (logIndicator) logIndicator.innerText = text;
            if (logIndicatorMobile) logIndicatorMobile.innerText = text;
        }

        function switchTab(mode) {
            currentMode = mode;
            [tabBlogBtn, tabQuizBtn, tabProjectBtn].forEach(btn => {
                if(!btn) return;
                btn.className = "tab-btn px-4 py-2.5 rounded-t-xl bg-transparent text-gray-500 border border-transparent -mb-[1px] hover:text-gray-300 transition cursor-pointer flex items-center gap-1.5";
            });

            if (mode === 'blog' && tabBlogBtn) {
                tabBlogBtn.className = "tab-btn active px-4 py-2.5 rounded-t-xl bg-gray-800 text-blue-400 border-t-2 border-t-blue-500 border-x border-gray-700 -mb-[1px] z-10 font-bold transition cursor-pointer flex items-center gap-1.5";
            } else if (mode === 'quiz' && tabQuizBtn) {
                tabQuizBtn.className = "tab-btn active px-4 py-2.5 rounded-t-xl bg-gray-800 text-blue-400 border-t-2 border-t-blue-500 border-x border-gray-700 -mb-[1px] z-10 font-bold transition cursor-pointer flex items-center gap-1.5";
            } else if (mode === 'project' && tabProjectBtn) {
                tabProjectBtn.className = "tab-btn active px-4 py-2.5 rounded-t-xl bg-gray-800 text-blue-400 border-t-2 border-t-blue-500 border-x border-gray-700 -mb-[1px] z-10 font-bold transition cursor-pointer flex items-center gap-1.5";
            }
            updateLogSlider();
        }

        tabBlogBtn?.addEventListener("click", () => switchTab('blog'));
        tabQuizBtn?.addEventListener("click", () => switchTab('quiz'));
        tabProjectBtn?.addEventListener("click", () => switchTab('project'));

        const navigate = (direction) => {
            if (currentMode === 'blog') {
                const totalPages = Math.max(Math.ceil((DATA.blogLogs?.length || 0) / itemsPerPage), 1);
                blogPage = (blogPage + direction + totalPages) % totalPages;
            } else if (currentMode === 'quiz') {
                const totalPages = Math.max(Math.ceil((DATA.quizzes?.length || 0) / itemsPerPage), 1);
                quizPage = (quizPage + direction + totalPages) % totalPages;
            } else {
                const totalPages = Math.max(Math.ceil((DATA.miniProjects?.length || 0) / itemsPerPage), 1);
                projectPage = (projectPage + direction + totalPages) % totalPages;
            }
            updateLogSlider();
        };

        document.getElementById("log-prev")?.addEventListener("click", () => navigate(-1));
        document.getElementById("log-next")?.addEventListener("click", () => navigate(1));
        document.getElementById("log-prev-mobile")?.addEventListener("click", () => navigate(-1));
        document.getElementById("log-next-mobile")?.addEventListener("click", () => navigate(1));

        initLogs();

    } catch (err) {
        console.error("통합 로그 슬라이더 컴파일 에러: ", err);
    }
// ==========================================
    // 💡 4. 퀴즈 상세 모달 인터랙션 제어 모듈 (자동화 버전)
    // ==========================================
    const quizModal = document.getElementById("quiz-modal");
    const quizModalContent = document.getElementById("quiz-modal-content");
    const quizModalCloseBtn = document.getElementById("quiz-modal-close");
    const quizModalChapter = document.getElementById("quiz-modal-chapter");
    const quizModalTitle = document.getElementById("quiz-modal-title");
    const quizModalBody = document.getElementById("quiz-modal-body");

    window.openQuizModal = async function(quizId) {
        if (!DATA.quizzes) return;
        const quiz = DATA.quizzes.find(q => q.id === quizId);
        if (!quiz) return;

        if (quizModalChapter) quizModalChapter.innerText = quiz.chapter;
        if (quizModalTitle) quizModalTitle.innerText = quiz.title;
        
        if (quizModalBody) {
            quizModalBody.innerHTML = `
                <div class="flex flex-col items-center justify-center h-40 text-gray-400">
                    <i class="fas fa-spinner fa-spin text-2xl mb-2 text-blue-500"></i>
                    <p class="text-xs">Github에서 문제 데이터를 불러오는 중입니다...</p>
                </div>
            `;
        }

        if (quizModal) {
            quizModal.classList.remove("hidden");
            void quizModal.offsetWidth;
            quizModal.classList.remove("opacity-0", "pointer-events-none");
            quizModal.classList.add("flex");
            if (quizModalContent) quizModalContent.classList.replace("scale-95", "scale-100");
            document.body.style.overflow = "hidden";
        }

        try {
            const response = await fetch(quiz.mdRawUrl);
            if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
            const mdText = await response.text();

            const guideBox = quiz.guideHTML ? `
                <div class="bg-gray-950 p-4 rounded-xl border border-gray-800 text-xs text-gray-400 leading-relaxed">
                    ${quiz.guideHTML}
                </div>
            ` : '';

            // 🌟 2. htmlContent 조립 시 guideBox 변수를 쏙 집어넣습니다.
            let htmlContent = `
                <div class="space-y-6">
                    ${guideBox}
                    <div class="space-y-4 border-l border-gray-800 pl-4 ml-1">
            `;

            // 한 줄 전체가 오직 '---'로만 이루어진 마크다운 수평선 기준으로 쪼개기
            const problems = mdText.split(/^\s*---\s*$/m);

            problems.forEach(problem => {
                const text = problem.trim();
                if (!text) return;

                const numMatch = text.match(/\[(\d+)번\]/);
                if (!numMatch) return;

                const qNum = numMatch[1];

                const codeMatch = text.match(/```([\s\S]*?)```/);
                const codeContent = codeMatch ? codeMatch[1].trim() : '';

                let qText = '';
                if (codeMatch) {
                    const treatText = text.split('```')[0];
                    qText = treatText.replace(/\[\d+번\]\s*/, '').trim();
                } else {
                    qText = text.replace(/\[\d+번\]\s*/, '').trim();
                }

                // 🔥 [요구사항 1] 문제 내부의 모든 ** 또는 **** 마크다운 강조 기호 완전히 제거하기
                qText = qText.replace(/\*\*/g, '');

                // 줄바꿈 반영
                qText = qText.replace(/\n/g, '<br>');

                // 파일명 및 Raw 주소 빌드
                const paddedNum = String(qNum).padStart(2, '0');
                const fileName = `${quiz.prefix}_${paddedNum}.sql`;
                // 코드 내용을 순수 텍스트로 가져와야 하므로 raw 주소 기반으로 연결합니다.
                const rawFileUrl = `https://raw.githubusercontent.com/Goonos/test3/main/quizzes/answers/${fileName}`;

                // HTML 조립
                htmlContent += `
                    <div class="pb-5 border-b border-gray-800/50">
                        <h4 class="text-white font-bold mb-3 text-sm md:text-base leading-relaxed">[${qNum}번] ${qText}</h4>
                        
                        ${codeContent ? `
                        <div class="bg-gray-950/80 rounded-lg p-3 md:p-4 mb-4 border border-gray-800 overflow-x-auto scrollbar-hide">
                            <span class="block text-[10px] text-gray-500 font-mono mb-2">💡 예상 실행 결과</span>
                            <pre class="text-[10px] md:text-xs text-gray-300 font-mono whitespace-pre"><code>${codeContent}</code></pre>
                        </div>
                        ` : ''}
                        
                        <div class="flex flex-col gap-3 mt-2">
                            <div class="flex justify-end items-center">
                                <button onclick="toggleAnswerCode('${rawFileUrl}', 'ans-${quizId}-${qNum}')" class="px-2.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium rounded-md hover:bg-blue-500/20 hover:border-blue-500/40 cursor-pointer transition-all flex items-center gap-1.5">
                                    <i class="fas fa-code"></i> 작성 SQL 보기 <i class="fas fa-chevron-down text-[10px] ml-0.5"></i>
                                </button>
                            </div>
                            
                            <div id="ans-${quizId}-${qNum}" class="hidden w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 md:p-4 overflow-x-auto scrollbar-hide">
                                <span class="block text-xs md:text-sm font-semibold tracking-wide text-blue-400 font-sans mb-2.5">📝 작성 SQL 스크립트</span>
                                <pre class="text-[10px] md:text-xs text-blue-300 font-mono whitespace-pre"><code class="language-sql">로딩 중...</code></pre>
                            </div>
                        </div>
                    </div>
                `;
            });

            htmlContent += `</div></div>`;

            if (quizModalBody) {
                quizModalBody.innerHTML = htmlContent;
            }

        } catch (error) {
            console.error(error);
            if (quizModalBody) {
                quizModalBody.innerHTML = `
                    <div class="text-red-400 text-center py-10 bg-red-500/10 rounded-lg border border-red-500/20">
                        <i class="fas fa-exclamation-triangle mb-2 text-xl"></i><br>
                        문제 데이터를 불러오는 데 실패했습니다.<br>
                        <span class="text-xs text-gray-500">Github 경로를 확인해 주세요.</span>
                    </div>
                `;
            }
        }
    };

    // 🚀 [최종 업그레이드] 작성 코드 실시간 로드 및 완벽한 포맷팅 엔진
    window.toggleAnswerCode = async function(fileUrl, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // 이미 열려있다면 토글 닫기
        if (!container.classList.contains("hidden")) {
            container.classList.add("hidden");
            return;
        }

        container.classList.remove("hidden");
        const codeElement = container.querySelector("code");

        // innerText 대신 textContent를 사용하여 줄바꿈(\n)이 무시되는 현상 방지
        if (codeElement && codeElement.textContent.trim() === "로딩 중...") {
            try {
                // 1️⃣ 외부 SQL 포맷터 로드 (CDN)
                if (typeof window.sqlFormatter === 'undefined') {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/sql-formatter@15.4.5/dist/sql-formatter.min.js';
                        script.onload = () => resolve();
                        script.onerror = () => reject();
                        document.head.appendChild(script);
                    });
                }

                // 2️⃣ Github에서 순수 SQL 소스코드 fetch
                const res = await fetch(fileUrl);
                if (!res.ok) throw new Error("코드를 가져오지 못했습니다.");
                let sqlCode = await res.text();
                
                // 3️⃣ [치명적 버그 해결] 줄바꿈 기호(\n)가 증발하면서 department_idFROM 처럼 단어가 붙어버리는 현상 방지
                // 모든 줄바꿈 기호 앞뒤에 강제로 공백(스페이스)을 하나씩 넣어 단어를 완벽히 띄워줍니다.
                sqlCode = sqlCode.replace(/\n/g, ' \n ');

                // 4️⃣ 오라클 환경 특성상 들어간 '/' 기호를 표준 ';' 로 완벽 치환
                sqlCode = sqlCode.replace(/(^|\s)\/(\s|$)/g, '$1;$2');

                // 5️⃣ 구문 절 기준 줄바꿈 및 포맷팅 수행
                const formattedSql = window.sqlFormatter.format(sqlCode, {
                    language: 'sql',                 // 표준 SQL 파서를 사용하여 SELECT, FROM, WHERE 줄바꿈 강제 적용
                    tabWidth: 4,                     // 들여쓰기 4칸
                    keywordCase: 'upper',            // 예약어는 대문자로 깔끔하게
                    linesBetweenQueries: 1,          // 쿼리 간격 강제 유지
                    logicalOperatorNewline: 'before' // AND, OR 등의 논리 연산자도 무조건 새 줄로
                });
                
                // 6️⃣ innerText가 아닌 textContent를 주입해야 브라우저가 포맷팅된 줄바꿈을 그대로 화면에 그립니다.
                codeElement.textContent = formattedSql.trim();

                // 7️⃣ 정렬된 코드 블록에 Highlight.js 구문 강조 다시 입히기
                if (typeof hljs !== 'undefined') {
                    codeElement.className = "language-sql"; // 클래스 초기화 방지
                    hljs.highlightElement(codeElement);
                }
            } catch (err) {
                console.error(err);
                codeElement.textContent = `-- ❌ 에러:작성된 스크립트가 존재하지 않거나, 스크립트를 불러오는데 실패했습니다.\n`;
            }
        }
    };

    window.closeQuizModal = function() {
        if (quizModal) {
            quizModal.classList.add("opacity-0", "pointer-events-none");
            if (quizModalContent) quizModalContent.classList.replace("scale-100", "scale-95");
            setTimeout(() => {
                quizModal.classList.add("hidden");
                quizModal.classList.remove("flex");
                document.body.style.overflow = "";
                if (quizModalBody) quizModalBody.innerHTML = "";
            }, 300);
        }
    };

    quizModalCloseBtn?.addEventListener("click", window.closeQuizModal);
    quizModal?.addEventListener("click", (e) => { if (e.target === quizModal) window.closeQuizModal(); });

    // ==========================================
    // 5. 미니 앨범 (Gallery 모달)
    // ==========================================
    try {
        const albumGrid = document.getElementById("album-grid");
        const galleryModal = document.getElementById("gallery-modal");
        const modalImg = document.getElementById("modal-img");
        const modalTitle = document.getElementById("modal-title");
        const modalComment = document.getElementById("modal-comment");
        const modalClose = document.getElementById("modal-close");
        const modalPrev = document.getElementById("modal-prev");
        const modalNext = document.getElementById("modal-next");

        let currentAlbumIndex = 0;

        function updateModalData(idx) {
            const currentItem = DATA.album[idx];
            if (!currentItem) return;
            if (modalImg) modalImg.src = currentItem.src;
            if (modalTitle) modalTitle.textContent = currentItem.title;
            if (modalComment) modalComment.innerHTML = currentItem.comment;
        }

        if (albumGrid && DATA.album) {
            albumGrid.innerHTML = ""; 
            DATA.album.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.className = "relative aspect-square bg-gray-900 border border-gray-700/60 rounded-lg overflow-hidden cursor-pointer group hover:border-blue-500 transition shadow-inner";
                
                itemElement.innerHTML = `
                    <div class="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px] font-sans group-hover:text-blue-400 transition z-10">
                        <i class="fas fa-image"></i>
                    </div>
                    <img src="${item.src}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-300 z-20" onerror="this.style.opacity='0';">
                `;

                itemElement.addEventListener("click", () => {
                    currentAlbumIndex = index;
                    updateModalData(currentAlbumIndex);
                    
                    if (galleryModal) {
                        galleryModal.classList.remove("hidden");
                        galleryModal.classList.add("flex");
                    }
                    document.body.style.overflow = "hidden";
                });

                albumGrid.appendChild(itemElement);
            });
        }

        if (modalPrev) {
            modalPrev.addEventListener("click", (e) => {
                e.stopPropagation(); 
                if (DATA.album && DATA.album.length > 0) {
                    currentAlbumIndex = (currentAlbumIndex - 1 + DATA.album.length) % DATA.album.length;
                    updateModalData(currentAlbumIndex);
                }
            });
        }

        if (modalNext) {
            modalNext.addEventListener("click", (e) => {
                e.stopPropagation(); 
                if (DATA.album && DATA.album.length > 0) {
                    currentAlbumIndex = (currentAlbumIndex + 1) % DATA.album.length;
                    updateModalData(currentAlbumIndex);
                }
            });
        }

        if (modalClose && galleryModal) {
            const closeModal = () => {
                galleryModal.classList.add("hidden");
                galleryModal.classList.remove("flex");
                document.body.style.overflow = "";
            };
            modalClose.addEventListener("click", closeModal);
            galleryModal.addEventListener("click", (e) => { 
                if (e.target === galleryModal) closeModal(); 
            });
        }
    } catch (e) {
        console.error("Album & Modal Elements 예외 처리:", e);
    }

    // ==========================================
    // 6. 구문 강조(Highlight.js) 모듈 최초 로드
    // ==========================================
    try {
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }
    } catch (e) {
        console.error("Highlight.js 모듈 로드 누락 예외 처리:", e);
    }

    // ==========================================
    // 💡 미니 프로젝트 팝업 모달 제어 함수 (A4 분할뷰)
    // ==========================================
    const projModal = document.getElementById("project-modal");
    const projModalContent = document.getElementById("project-modal-content");
    const projModalCloseBtn = document.getElementById("project-modal-close");
    const projModalDate = document.getElementById("project-modal-date");
    const projModalTitle = document.getElementById("project-modal-title");
    const projModalLeft = document.getElementById("project-modal-left");
    const projModalRight = document.getElementById("project-modal-right");

    window.openProjectModal = function(projId) {
        if (!DATA.miniProjects) return;
        const proj = DATA.miniProjects.find(p => p.id === projId);
        if (!proj) return;

        // 1. 헤더 데이터 주입
        if (projModalDate) projModalDate.innerText = proj.date;
        if (projModalTitle) projModalTitle.innerText = proj.title;
        
        // 2. 왼쪽 영역: PDF 또는 이미지 주입
        if (projModalLeft) {
            const isPdf = proj.docUrl.toLowerCase().endsWith('.pdf');
            if (isPdf) {
                // 🔥 PDF 뒤에 #toolbar=0&navpanes=0&view=FitH 옵션을 추가합니다.
                projModalLeft.innerHTML = `<iframe src="${proj.docUrl}#toolbar=0&navpanes=0&view=FitH" class="w-full h-full border-none"></iframe>`;
            } else {
                // 이미지일 경우 img 태그 사용
                projModalLeft.innerHTML = `<img src="${proj.docUrl}" class="w-full h-full object-contain bg-gray-950">`;
            }
        }

        // 3. 오른쪽 영역: 문제 및 코드 리스트 주입
        if (projModalRight) {
            let rightHtml = '';
            if (proj.qaList && proj.qaList.length > 0) {
                proj.qaList.forEach((qa, idx) => {
                    rightHtml += `
    <div class="pb-6 border-b border-gray-800/60 last:border-0 last:pb-0">
        <h5 class="text-white font-bold text-sm md:text-base leading-relaxed mb-3">
            <span class="text-blue-400 mr-1">Q${idx + 1}.</span> ${qa.question}
        </h5>
        <div class="bg-gray-950/80 border border-gray-800 rounded-lg p-3 md:p-4 overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-gray-950 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
            <pre class="text-[10px] md:text-xs font-mono [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"><code class="language-sql">${qa.code.trim()}</code></pre>
        </div>
    </div>
`;
                });
            }
            projModalRight.innerHTML = rightHtml;
        }

        // 4. 모달 열기 및 애니메이션 적용
        if (projModal) {
            projModal.classList.remove("hidden");
            void projModal.offsetWidth;
            projModal.classList.remove("opacity-0", "pointer-events-none");
            projModal.classList.add("flex");
            if (projModalContent) projModalContent.classList.replace("scale-95", "scale-100");
            document.body.style.overflow = "hidden"; // 배경 스크롤 방지
        }

        // 5. 우측 코드 블록 구문 강조(Highlight.js) 적용
        setTimeout(() => {
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('#project-modal-right pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }, 100);
    };

    window.closeProjectModal = function() {
        if (projModal) {
            projModal.classList.add("opacity-0", "pointer-events-none");
            if (projModalContent) projModalContent.classList.replace("scale-100", "scale-95");
            setTimeout(() => {
                projModal.classList.add("hidden");
                projModal.classList.remove("flex");
                document.body.style.overflow = "";
                // iframe 및 내용 초기화 (메모리 확보 및 영상 소리 꺼짐 효과)
                if (projModalLeft) projModalLeft.innerHTML = "";
                if (projModalRight) projModalRight.innerHTML = "";
            }, 300);
        }
    };

    projModalCloseBtn?.addEventListener("click", window.closeProjectModal);
    projModal?.addEventListener("click", (e) => { 
        if (e.target === projModal) window.closeProjectModal(); 
    });
}); // 💡 여기가 유일하고 올바른 닫는 괄호입니다!


// ==========================================
// 💡 PPT 슬라이더 (Architecture Story) 제어 로직
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('ppt-slider');
    const prevBtn = document.getElementById('ppt-prev');
    const nextBtn = document.getElementById('ppt-next');
    const indicator = document.getElementById('ppt-indicator');
    const dots = document.querySelectorAll('.ppt-dot');

    if (!slider) return;

    // 슬라이드 이동 함수 (버튼 클릭용)
    const slideTo = (direction) => {
        const slideWidth = slider.clientWidth;
        slider.scrollBy({ left: direction * slideWidth, behavior: 'smooth' });
    };

    if (prevBtn) prevBtn.addEventListener('click', () => slideTo(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideTo(1));

    // 스크롤 이벤트 감지하여 현재 슬라이드 번호 및 점(dot) 업데이트
    slider.addEventListener('scroll', () => {
        const slideWidth = slider.clientWidth;
        // 현재 스크롤 위치를 너비로 나누어 현재 인덱스(0~4) 계산
        const currentIndex = Math.round(slider.scrollLeft / slideWidth);
        
        // 🔥 PC 인디케이터 텍스트 업데이트 (Slide 1 / 5 부터 시작)
        if (indicator) {
            indicator.innerText = `Slide ${currentIndex + 1} / 5`;
        }
        
        // 모바일 하단 점(dot) 색상 업데이트
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.remove('bg-gray-600');
                dot.classList.add('bg-blue-500');
            } else {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-600');
            }
        });
    });

    // 🔥 ERD 모달창 닫기 이벤트 바인딩
    const erdModal = document.getElementById('erd-modal');
    const erdModalCloseBtn = document.getElementById('erd-modal-close');
    
    if (erdModal && erdModalCloseBtn) {
        // X 버튼 클릭 시 닫기
        erdModalCloseBtn.addEventListener('click', () => {
            erdModal.classList.remove('opacity-100', 'pointer-events-auto');
            setTimeout(() => erdModal.classList.add('hidden'), 300);
        });
        
        // 배경(검은 영역) 클릭 시 닫기
        erdModal.addEventListener('click', (e) => {
            if (e.target === erdModal) {
                erdModal.classList.remove('opacity-100', 'pointer-events-auto');
                setTimeout(() => erdModal.classList.add('hidden'), 300);
            }
        });
    }
});

// 🔥 ERD 팝업창 열기 함수
function openErdModal(imageSrc, titleText) {
    const erdModal = document.getElementById('erd-modal');
    const erdModalImg = document.getElementById('erd-modal-img');
    const erdModalTitle = document.getElementById('erd-modal-title');

    if (erdModal && erdModalImg) {
        // 1. 클릭한 이미지 주소와 제목을 모달창에 주입
        erdModalImg.src = imageSrc;
        
        if (titleText && erdModalTitle) {
            erdModalTitle.innerHTML = `<i class="fas fa-search-plus mr-1"></i> ${titleText} (화면 아무 곳이나 클릭하면 닫힙니다)`;
        }

        // 2. 모달 열기 애니메이션 실행
        erdModal.classList.remove('hidden');
        setTimeout(() => {
            erdModal.classList.remove('pointer-events-none');
            erdModal.classList.add('opacity-100');
        }, 10);
    }
}

// 🔥 이미지 팝업창 닫기 함수
function closeErdModal() {
    const erdModal = document.getElementById('erd-modal');
    if (erdModal) {
        // 투명하게 만들고 다시 클릭 방지
        erdModal.classList.remove('opacity-100');
        erdModal.classList.add('pointer-events-none');
        
        // 애니메이션(300ms) 종료 후 숨김 처리
        setTimeout(() => {
            erdModal.classList.add('hidden');
            // 닫힐 때 잔상을 방지하기 위해 src 초기화
            const erdModalImg = document.getElementById('erd-modal-img');
            if(erdModalImg) erdModalImg.src = "";
        }, 300);
    }
}

