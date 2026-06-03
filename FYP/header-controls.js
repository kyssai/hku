(function () {

  var FONT_KEY = "fypFontSize";

  var LANG_KEY = "fypLang";



  var I18N = {

    en: {

      site_title: "Final Year Project",

      nav_home: "Home",

      nav_team: "Team Member",

      nav_progress: "Project Progress",

      nav_contact: "Contact Us",

      label_font: "Text size",

      label_lang: "Language",

      footer_sitemap: "Site Map",

      footer_copyright: "© COMP7705 MSc(CompSc) Project [2025] University of Hong Kong (HKU)",

      footer_hku_icon_alt: "University of Hong Kong",

      logo_alt: "HKU Logo",

      img_overview_alt: "Project overview diagram",

      img_objectives_alt: "Project objectives illustration",

      img_outcomes_alt: "Expected outcomes illustration",

      img_challenges_alt: "Key challenges illustration",

      img_technical_alt: "Technical stack diagram",

      h2_project_information: "Project Information",

      h2_main_details: "Main Page Details",

      h3_overview: "Overview",

      project_title_label: "Project Title:",

      h3_objectives: "Objectives",

      h3_challenges: "Addressing Key Challenges",

      h3_technical_stack: "Technical Stack",

      h3_expected_outcomes: "Expected Outcomes",

      h2_team_members: "Team Members",

      h3_member_info: "Member Information",

      label_mentor: "Mentor:",

      label_team_member: "Team member:",

      h2_project_progress: "Project Progress",

      hint_deadlines: "Important deadlines for students to submit their works.",

      th_task: "Task",

      th_deadline_submit: "Deadline (for students to submit their works)",

      th_deadline: "Deadline",

      h2_contact_us: "Contact Us",

      page_title_home: "FYP Project Website",

      page_title_team: "Team Member - FYP Website",

      page_title_progress: "Project Progress - FYP Website",

      page_title_contact: "Contact Us - FYP Website",

      home_overview_p:

        "The global AI recruitment market is expanding rapidly, with companies like Amazon using AI to handle 60–70% of initial applicant interactions. In Hong Kong, HR teams face talent shortages and increasing application volumes, creating an urgent need for efficient, fair, and scalable screening solutions. This project develops an innovative AI-powered virtual interviewer that automates the early-stage screening process for both technical and behavioral roles.",

      home_project_name: "AI-Powered Virtual Interviewer for Technical & Behavioral Screening",

      home_obj_1:

        "Build an interactive web-based interviewer using Python, Streamlit, and large language model APIs (e.g., GPT-4o).",

      home_obj_2:

        "Generate adaptive, role-specific questions—including code challenges for technical roles and STAR-method probes for behavioral roles.",

      home_obj_3:

        "Automatically score candidate responses on relevance, technical depth, communication clarity, and cultural alignment.",

      home_obj_4:

        "Deliver a shortlist with detailed reports to HR teams, reducing screening time by an estimated 50–80%.",

      home_bias_label: "Bias Mitigation:",

      home_bias_body:

        "The system anonymizes resumes (removing names, gender cues, and institution names) and uses carefully engineered prompts to focus solely on skills and responses.",

      home_privacy_label: "Privacy Protection:",

      home_privacy_body:

        "All interview data is stored locally in an encrypted SQLite database; candidates receive clear bilingual consent notices, and recordings are deleted after transcription, complying with Hong Kong’s PDPO principles.",

      home_ts_1: "Python (FastAPI/Flask) for backend logic",

      home_ts_2: "Streamlit for rapid UI prototyping",

      home_ts_3: "OpenAI/Groq APIs for LLM-based conversation and scoring",

      home_ts_4: "Optional: Whisper for speech-to-text, OpenCV for emotion analysis (future extension)",

      home_outcomes_p:

        "A fully functional prototype that demonstrates tangible benefits in efficiency, consistency, and objectivity. The project will also produce a bias-testing report and a privacy compliance overview, contributing to the responsible adoption of AI in HR. By the end of the semester, the team will deliver a demo video, a project webpage, and a final report detailing system design, evaluation results, and recommendations for real-world deployment.",

      team_badge_mentor: "MENTOR",

      team_role_mentor: "Mentor",

      team_role_member: "Team Member",

      team_role_application: "Team Member (Application Director)",

      team_role_ai_director: "Team Member (AI Director)",

      team_role_interview_director: "Team Member (Interview Director)",

      team_role_cyber_security_director: "Team Member (Cyber Security Director)",

      team_role_design_web3_director: "Team Member (Design and Web3 Director)",

      team_desc_mentor: "Project mentor and academic advisor.",

      team_desc_member: "Final year project team member.",

      team_desc_cheung: "Final-year project team member responsible for developing the Android and iOS mobile applications.",

      team_desc_chung:
        "Final-year project team member and AI Director, primarily responsible for LLM development and communication architecture.",

      team_desc_kwok:
        "Final-year project team member and Interview Director, primarily responsible for interview development.",

      team_desc_lau:
        "Final-year project team member and Cyber Security Director, primarily responsible for attack and defense in our AI interview system.",

      team_desc_lee:
        "Final-year project team member and Design and Web3 Director, primarily responsible for website development and Web3 functionality.",

      contact_email_line: "Email: u3638360@connect.hku.hk",

      contact_phone_line: "Phone: +852 60730930",

      prog_r1_task: "Detailed Project Proposal",

      prog_r1_d1: "March 10, 2026",

      prog_r1_d2: "March 27, 2026",

      label_download_pdf: "Download PDF",
      label_watch_video: "Watch Video",
      video_not_supported: "Your browser does not support the video tag.",
      progress_gallery_title: "Project Progress Update Gallery",
      progress_gallery_hint: "Screenshots and materials for project progress updates.",
      progress_update_1_topic: "Project Progress Updates 1",
      progress_update_2_topic: "Project Progress Updates 2",
      progress_update_3_topic: "Project Progress Updates 3",
      progress_update_4_topic: "Project Progress Updates 4",
      progress_pending_desc: "Pending update. Content and screenshots will be uploaded soon.",

      prog_r2_task: "Project Progress Updates 1",

      prog_r2_d1: "April 7, 2026",

      prog_r2_d2: "April 14, 2026",

      prog_r3_task: "Project Progress Updates 2",

      prog_r3_d1: "May 5, 2026",

      prog_r4_task: "Interim Report and Presentation",

      prog_r4_d1: "June 1, 2026",

      prog_r5_task: "Project Progress Updates 3",

      prog_r5_d1: "June 16, 2026",

      prog_r6_task: "Project Progress Updates 4",

      prog_r6_d1: "July 6, 2026",

      prog_r7_task: "Project Webpage",

      prog_r7_d1: "July 13, 2026",

      prog_r8_task: "Oral Examination",

      prog_r8_d1: "End of July 2026",

      prog_r9_task: "Project Report",

      prog_r9_d1: "July 17, 2026"

    },

    "zh-TW": {

      site_title: "最終年度專案",

      nav_home: "首頁",

      nav_team: "組員",

      nav_progress: "專案進度",

      nav_contact: "聯絡我們",

      label_font: "文字大小",

      label_lang: "語言",

      footer_sitemap: "網站地圖",

      footer_copyright: "© COMP7705 MSc(CompSc) 專題 [2025] 香港大學 (HKU)",

      footer_hku_icon_alt: "香港大學",

      logo_alt: "香港大學標誌",

      img_overview_alt: "專案概述圖",

      img_objectives_alt: "專案目標圖",

      img_outcomes_alt: "預期成果圖",

      img_challenges_alt: "關鍵挑戰圖",

      img_technical_alt: "技術堆疊圖",

      h2_project_information: "專案資訊",

      h2_main_details: "主頁詳情",

      h3_overview: "概述",

      project_title_label: "專題名稱：",

      h3_objectives: "目標",

      h3_challenges: "關鍵挑戰與應對",

      h3_technical_stack: "技術堆疊",

      h3_expected_outcomes: "預期成果",

      h2_team_members: "組員",

      h3_member_info: "成員資訊",

      label_mentor: "導師：",

      label_team_member: "組員：",

      h2_project_progress: "專案進度",

      hint_deadlines: "學生提交作業的重要截止日期。",

      th_task: "項目",

      th_deadline_submit: "截止日期（學生提交作業）",

      th_deadline: "截止日期",

      h2_contact_us: "聯絡我們",

      page_title_home: "FYP 專案網站",

      page_title_team: "組員 - FYP 網站",

      page_title_progress: "專案進度 - FYP 網站",

      page_title_contact: "聯絡我們 - FYP 網站",

      home_overview_p:

        "全球 AI 招聘市場正快速擴張，亞馬遜等企業已使用 AI 處理約 60–70% 的初步應徵互動。在香港，人力資源團隊面臨人才短缺與申請量上升，亟需高效、公平且可擴展的篩選方案。本專案開發創新的 AI 虛擬面試官，自動化技術與行為職缺的早期篩選流程。",

      home_project_name: "AI 驅動之技術與行為篩選虛擬面試官",

      home_obj_1: "以 Python、Streamlit 與大型語言模型 API（如 GPT-4o）建置互動式網路面試官。",

      home_obj_2: "產生適應職缺的情境題——含技術職的程式挑戰與行為職的 STAR 提問。",

      home_obj_3: "自動評分應徵者回答的相關性、技術深度、溝通清晰度與文化契合度。",

      home_obj_4: "向人力資源團隊提供附詳細報告的短名單，預估可將篩選時間縮短 50–80%。",

      home_bias_label: "降低偏見：",

      home_bias_body:

        "系統會匿名化履歷（移除姓名、性別線索與學校名稱），並以精心設計的提示詞專注於技能與回答內容。",

      home_privacy_label: "隱私保護：",

      home_privacy_body:

        "所有面試資料皆儲存於本機加密 SQLite 資料庫；應徵者可收到清楚的中英文同意說明，錄音在轉寫後刪除，符合香港《個人資料（私隱）條例》（PDPO）原則。",

      home_ts_1: "Python（FastAPI／Flask）後端邏輯",

      home_ts_2: "Streamlit 快速 UI 原型",

      home_ts_3: "OpenAI／Groq API 進行 LLM 對話與評分",

      home_ts_4: "選用：Whisper 語音轉文字、OpenCV 情緒分析（未來延伸）",

      home_outcomes_p:

        "可展示效率、一致性與客觀性效益的可運作原型；專案亦將產出偏見測試報告與隱私合規概述，促進 HR 領域負責任地採用 AI。學期末團隊將提交示範影片、專案網頁與期末報告，說明系統設計、評估結果與實務部署建議。",

      team_badge_mentor: "導師",

      team_role_mentor: "導師",

      team_role_member: "組員",

      team_role_application: "組員（應用程式總監）",

      team_role_ai_director: "組員（AI 總監）",

      team_role_interview_director: "組員（面試總監）",

      team_role_cyber_security_director: "組員（網絡安全總監）",

      team_role_design_web3_director: "組員（設計與 Web3 總監）",

      team_desc_mentor: "專題導師與學術顧問。",

      team_desc_member: "最終年度專題組員。",

      team_desc_cheung: "最終年度專題組員，負責開發 Android 與 iOS 流動應用程式。",

      team_desc_chung: "最終年度專題組員並擔任 AI 總監，主要負責大型語言模型（LLM）開發與通訊架構。",

      team_desc_kwok: "最終年度專題組員並擔任面試總監，主要負責面試模組開發。",

      team_desc_lau: "最終年度專題組員並擔任網絡安全總監，主要負責 AI 面試系統的攻防安全。",

      team_desc_lee: "最終年度專題組員並擔任設計與 Web3 總監，主要負責網站開發與 Web3 功能。",

      contact_email_line: "電郵：u3638360@connect.hku.hk",

      contact_phone_line: "電話：+852 60730930",

      prog_r1_task: "詳細專題計劃書",

      prog_r1_d1: "2026 年 3 月 10 日",

      prog_r1_d2: "2026 年 3 月 27 日",

      label_download_pdf: "下載 PDF",
      label_watch_video: "觀看影片",
      video_not_supported: "你的瀏覽器不支援影片播放。",
      progress_gallery_title: "專題進度更新展示",
      progress_gallery_hint: "專題進度更新的截圖與相關內容。",
      progress_update_1_topic: "專題進度更新 1",
      progress_update_2_topic: "專題進度更新 2",
      progress_update_3_topic: "專題進度更新 3",
      progress_update_4_topic: "專題進度更新 4",
      progress_pending_desc: "尚待更新，內容與截圖將稍後上傳。",

      prog_r2_task: "專題進度更新 1",

      prog_r2_d1: "2026 年 4 月 7 日",

      prog_r2_d2: "2026 年 4 月 14 日",

      prog_r3_task: "專題進度更新 2",

      prog_r3_d1: "2026 年 5 月 5 日",

      prog_r4_task: "中期報告與簡報",

      prog_r4_d1: "2026 年 6 月 1 日",

      prog_r5_task: "專題進度更新 3",

      prog_r5_d1: "2026 年 6 月 16 日",

      prog_r6_task: "專題進度更新 4",

      prog_r6_d1: "2026 年 7 月 6 日",

      prog_r7_task: "專題網頁",

      prog_r7_d1: "2026 年 7 月 13 日",

      prog_r8_task: "口試",

      prog_r8_d1: "2026 年 7 月底",

      prog_r9_task: "專題報告",

      prog_r9_d1: "2026 年 7 月 17 日"

    },

    "zh-CN": {

      site_title: "最终年度项目",

      nav_home: "首页",

      nav_team: "组员",

      nav_progress: "项目进度",

      nav_contact: "联系我们",

      label_font: "文字大小",

      label_lang: "语言",

      footer_sitemap: "网站地图",

      footer_copyright: "© COMP7705 MSc(CompSc) 专题 [2025] 香港大学 (HKU)",

      footer_hku_icon_alt: "香港大学",

      logo_alt: "香港大学标志",

      img_overview_alt: "项目概述图",

      img_objectives_alt: "项目目标图",

      img_outcomes_alt: "预期成果图",

      img_challenges_alt: "关键挑战图",

      img_technical_alt: "技术栈图",

      h2_project_information: "项目信息",

      h2_main_details: "主页详情",

      h3_overview: "概述",

      project_title_label: "专题名称：",

      h3_objectives: "目标",

      h3_challenges: "关键挑战与应对",

      h3_technical_stack: "技术栈",

      h3_expected_outcomes: "预期成果",

      h2_team_members: "组员",

      h3_member_info: "成员信息",

      label_mentor: "导师：",

      label_team_member: "组员：",

      h2_project_progress: "项目进度",

      hint_deadlines: "学生提交作业的重要截止日期。",

      th_task: "项目",

      th_deadline_submit: "截止日期（学生提交作业）",

      th_deadline: "截止日期",

      h2_contact_us: "联系我们",

      page_title_home: "FYP 项目网站",

      page_title_team: "组员 - FYP 网站",

      page_title_progress: "项目进度 - FYP 网站",

      page_title_contact: "联系我们 - FYP 网站",

      home_overview_p:

        "全球 AI 招聘市场正快速扩张，亚马逊等企业已使用 AI 处理约 60–70% 的初步应聘互动。在香港，人力资源团队面临人才短缺与申请量上升，亟需高效、公平且可扩展的筛选方案。本项目开发创新的 AI 虚拟面试官，自动化技术与行为岗位的早期筛选流程。",

      home_project_name: "AI 驱动的技术与行为筛选虚拟面试官",

      home_obj_1: "以 Python、Streamlit 与大型语言模型 API（如 GPT-4o）搭建交互式网页面试官。",

      home_obj_2: "生成适应岗位的情境题——含技术岗的编程挑战与行为岗的 STAR 提问。",

      home_obj_3: "自动评分应聘者回答的相关性、技术深度、沟通清晰度与文化契合度。",

      home_obj_4: "向人力资源团队提供附详细报告的短名单，预计可将筛选时间缩短 50–80%。",

      home_bias_label: "降低偏见：",

      home_bias_body:

        "系统会匿名化简历（移除姓名、性别线索与学校名称），并以精心设计的提示词专注于技能与回答内容。",

      home_privacy_label: "隐私保护：",

      home_privacy_body:

        "所有面试数据均存储于本地加密 SQLite 数据库；应聘者可收到清晰的中英文同意说明，录音在转写后删除，符合香港《个人资料（私隐）条例》（PDPO）原则。",

      home_ts_1: "Python（FastAPI／Flask）后端逻辑",

      home_ts_2: "Streamlit 快速 UI 原型",

      home_ts_3: "OpenAI／Groq API 进行 LLM 对话与评分",

      home_ts_4: "选用：Whisper 语音转文字、OpenCV 情绪分析（未来延伸）",

      home_outcomes_p:

        "可展示效率、一致性与客观性效益的可运行原型；项目还将产出偏见测试报告与隐私合规概述，促进 HR 领域负责任地采用 AI。学期末团队将提交演示视频、项目网页与期末报告，说明系统设计、评估结果与实务部署建议。",

      team_badge_mentor: "导师",

      team_role_mentor: "导师",

      team_role_member: "组员",

      team_role_application: "组员（应用程序总监）",

      team_role_ai_director: "组员（AI 总监）",

      team_role_interview_director: "组员（面试总监）",

      team_role_cyber_security_director: "组员（网络安全总监）",

      team_role_design_web3_director: "组员（设计与 Web3 总监）",

      team_desc_mentor: "专题导师与学术顾问。",

      team_desc_member: "最终年度专题组员。",

      team_desc_cheung: "最终年度专题组员，负责开发 Android 与 iOS 流动应用程序。",

      team_desc_chung: "最终年度专题组员并担任 AI 总监，主要负责大型语言模型（LLM）开发与通讯架构。",

      team_desc_kwok: "最终年度专题组员并担任面试总监，主要负责面试模块开发。",

      team_desc_lau: "最终年度专题组员并担任网络安全总监，主要负责 AI 面试系统的攻防安全。",

      team_desc_lee: "最终年度专题组员并担任设计与 Web3 总监，主要负责网站开发与 Web3 功能。",

      contact_email_line: "邮箱：u3638360@connect.hku.hk",

      contact_phone_line: "电话：+852 60730930",

      prog_r1_task: "详细专题计划书",

      prog_r1_d1: "2026 年 3 月 10 日",

      prog_r1_d2: "2026 年 3 月 27 日",

      label_download_pdf: "下载 PDF",
      label_watch_video: "观看视频",
      video_not_supported: "你的浏览器不支持视频播放。",
      progress_gallery_title: "专题进度更新展示",
      progress_gallery_hint: "专题进度更新的截图与相关内容。",
      progress_update_1_topic: "专题进度更新 1",
      progress_update_2_topic: "专题进度更新 2",
      progress_update_3_topic: "专题进度更新 3",
      progress_update_4_topic: "专题进度更新 4",
      progress_pending_desc: "待更新，内容与截图将稍后上传。",

      prog_r2_task: "专题进度更新 1",

      prog_r2_d1: "2026 年 4 月 7 日",

      prog_r2_d2: "2026 年 4 月 14 日",

      prog_r3_task: "专题进度更新 2",

      prog_r3_d1: "2026 年 5 月 5 日",

      prog_r4_task: "中期报告与演示",

      prog_r4_d1: "2026 年 6 月 1 日",

      prog_r5_task: "专题进度更新 3",

      prog_r5_d1: "2026 年 6 月 16 日",

      prog_r6_task: "专题进度更新 4",

      prog_r6_d1: "2026 年 7 月 6 日",

      prog_r7_task: "专题网页",

      prog_r7_d1: "2026 年 7 月 13 日",

      prog_r8_task: "口试",

      prog_r8_d1: "2026 年 7 月底",

      prog_r9_task: "专题报告",

      prog_r9_d1: "2026 年 7 月 17 日"

    }

  };



  function getLang() {

    var v = localStorage.getItem(LANG_KEY);

    if (v === "zh-TW" || v === "zh-CN" || v === "en") return v;

    return "en";

  }



  function getFontSize() {

    var v = localStorage.getItem(FONT_KEY);

    if (v === "sm" || v === "md" || v === "lg") return v;

    return "md";

  }



  function applyFontSize(size) {

    var html = document.documentElement;

    html.classList.remove("fyp-fs-sm", "fyp-fs-md", "fyp-fs-lg");

    html.classList.add("fyp-fs-" + size);

    localStorage.setItem(FONT_KEY, size);

    document.querySelectorAll("[data-action='font']").forEach(function (btn) {

      btn.setAttribute("aria-pressed", btn.getAttribute("data-value") === size ? "true" : "false");

      btn.classList.toggle("is-active", btn.getAttribute("data-value") === size);

    });

  }



  function applyLang(lang) {

    localStorage.setItem(LANG_KEY, lang);

    var dict = I18N[lang] || I18N.en;

    document.documentElement.lang = lang === "zh-TW" ? "zh-Hant" : lang === "zh-CN" ? "zh-Hans" : "en";



    document.querySelectorAll("[data-i18n]").forEach(function (el) {

      var key = el.getAttribute("data-i18n");

      if (dict[key] !== undefined) {

        if (el.tagName === "TITLE") {

          document.title = dict[key];

        } else {

          el.textContent = dict[key];

        }

      }

    });



    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {

      var spec = el.getAttribute("data-i18n-attr");

      if (!spec) return;

      var parts = spec.split(":");

      var attr = parts[0];

      var key = parts[1];

      if (dict[key] !== undefined) {

        el.setAttribute(attr, dict[key]);

      }

    });



    document.querySelectorAll("[data-action='lang']").forEach(function (btn) {

      var active = btn.getAttribute("data-value") === lang;

      btn.setAttribute("aria-pressed", active ? "true" : "false");

      btn.classList.toggle("is-active", active);

    });

    document.dispatchEvent(new CustomEvent("fyp-lang-change", { detail: { lang: lang } }));

  }



  window.fypApplyLang = function () {

    applyLang(getLang());

  };



  function initHeaderControls() {

    var bar = document.querySelector(".header-control-bar");

    if (!bar) return;



    applyFontSize(getFontSize());

    applyLang(getLang());



    bar.addEventListener("click", function (e) {

      var t = e.target && e.target.closest ? e.target.closest("[data-action]") : null;

      if (!t) return;

      var action = t.getAttribute("data-action");

      var value = t.getAttribute("data-value");

      if (action === "font" && value) {

        applyFontSize(value);

      }

      if (action === "lang" && value) {

        applyLang(value);

      }

    });

  }



  if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", initHeaderControls);

  } else {

    initHeaderControls();

  }

})();

