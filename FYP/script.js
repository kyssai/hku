(function () {
  const AUTH_KEY = "fypLoggedIn";
  const CONTENT_KEY = "fypMainContent";
  const PROJECT_INFO_KEY = "fypProjectInfoContent";
  const PROGRESS_KEY = "fypProgressData";
  const CONTACT_KEY = "fypContactContent";
  const TEAM_KEY = "fypTeamMembers";
  const HEADER_KEY = "fypHeaderConfig";
  const SNAPSHOT_FILE_NAME = "site-content-snapshot.json";
  const DEFAULT_TEAM = [
    {
      name: "CHEUNG CHUN HANG",
      id: "3036384309",
      role: "Team Member (Application Director)",
      photo: "IMG/mem1.png",
      description: "Final-year project team member responsible for developing the Android and iOS mobile applications."
    },
    {
      name: "CHUNG YUE CHEE",
      id: "3036384189",
      role: "Team Member (AI Director)",
      photo: "IMG/mem2.png",
      description:
        "Final-year project team member and AI Director, primarily responsible for LLM development and communication architecture."
    },
    {
      name: "KWOK WING HING",
      id: "3036383587",
      role: "Team Member (Interview Director)",
      photo: "IMG/mem3.png",
      description:
        "Final-year project team member and Interview Director, primarily responsible for interview development."
    },
    {
      name: "LAU CHIN KEI",
      id: "3036383771",
      role: "Team Member (Cyber Security Director)",
      photo: "IMG/mem4.png",
      description:
        "Final-year project team member and Cyber Security Director, primarily responsible for attack and defense in our AI interview system."
    },
    {
      name: "LEE WAI WA",
      id: "3036383604",
      role: "Team Member (Design and Web3 Director)",
      photo: "IMG/mem5.png",
      description:
        "Final-year project team member and Design and Web3 Director, primarily responsible for website development and Web3 functionality."
    },
    {
      name: "Professor YIU SIU MING",
      role: "Mentor",
      photo: "IMG/men1.png",
      description: "Project mentor and academic advisor."
    }
  ];
  const DEFAULT_PROGRESS_DATA = {
    note: "Important deadlines for students to submit their works.",
    primary: [
      { task: "Detailed Project Proposal", oldDeadline: "March 10, 2026", deadline: "March 27, 2026" },
      { task: "Project Progress Updates 1", oldDeadline: "April 7, 2026", deadline: "April 14, 2026" },
      { task: "Project Progress Updates 2", oldDeadline: "", deadline: "May 5, 2026" },
      { task: "Interim Report and Presentation", oldDeadline: "", deadline: "June 1, 2026" },
      { task: "Project Progress Updates 3", oldDeadline: "", deadline: "June 16, 2026" },
      { task: "Project Progress Updates 4", oldDeadline: "", deadline: "July 6, 2026" },
      { task: "Project Webpage", oldDeadline: "", deadline: "July 13, 2026" }
    ],
    final: [
      { task: "Oral Examination", deadline: "End of July 2026" },
      { task: "Project Report", deadline: "July 17, 2026" }
    ]
  };

  function setMessage(el, text, isError) {
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? "#dc2626" : "#5f6b85";
  }

  function parseMemberIdentity(member) {
    const rawName = (member && member.name) || "";
    const explicitId = member && member.id ? String(member.id).trim() : "";
    const match = rawName.match(/^(.+?)\s*\((\d+)\)\s*$/);
    if (explicitId) {
      const cleanName = rawName.replace(/\s*\([^)]*\)\s*$/, "").trim() || rawName;
      return { name: cleanName, id: explicitId };
    }
    if (match) {
      return { name: match[1].trim(), id: match[2] };
    }
    return { name: rawName.trim(), id: "" };
  }

  function formatMemberCardName(member) {
    const identity = parseMemberIdentity(member);
    if (identity.id) return identity.name + " (" + identity.id + ")";
    return identity.name;
  }

  function formatMemberInfoLine(member) {
    return formatMemberCardName(member);
  }

  function isMentorMember(member) {
    return (member && member.role ? member.role : "").toLowerCase().includes("mentor");
  }

  function getDefaultStudents() {
    return DEFAULT_TEAM.filter(function (member) {
      return !isMentorMember(member);
    });
  }

  function getDefaultMentor() {
    return (
      DEFAULT_TEAM.find(isMentorMember) ||
      DEFAULT_TEAM[DEFAULT_TEAM.length - 1]
    );
  }

  function reorderTeamMembers(members) {
    if (!Array.isArray(members) || members.length !== DEFAULT_TEAM.length) {
      return DEFAULT_TEAM.slice();
    }
    const mentor =
      members.find(isMentorMember) || getDefaultMentor();
    const students = getDefaultStudents().map(function (def) {
      const defIdentity = parseMemberIdentity(def);
      const found = members.find(function (member) {
        if (isMentorMember(member)) return false;
        const identity = parseMemberIdentity(member);
        if (defIdentity.id && identity.id && identity.id === defIdentity.id) return true;
        return identity.name.toUpperCase() === defIdentity.name.toUpperCase();
      });
      if (!found) return Object.assign({}, def);
      const foundIdentity = parseMemberIdentity(found);
      return Object.assign({}, def, found, {
        name: foundIdentity.name || defIdentity.name,
        id: defIdentity.id || foundIdentity.id || "",
        role: found.role || def.role,
        photo: found.photo || def.photo,
        description: found.description || def.description
      });
    });
    return students.concat([mentor]);
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function markupToHtml(rawText) {
    const safe = escapeHtml(rawText || "");
    return safe
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/__(.+?)__/g, "<u>$1</u>")
      .replace(/\n/g, "<br>");
  }

  function stripHtmlToText(htmlText) {
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlText || "";
    return (tmp.textContent || tmp.innerText || "").trim();
  }

  function setupFormatButtons() {
    const buttons = document.querySelectorAll(".format-btn");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.getAttribute("data-target");
        const wrap = button.getAttribute("data-wrap") || "";
        const input = document.getElementById(targetId);
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const selected = input.value.slice(start, end);
        const wrapped = wrap + selected + wrap;
        input.setRangeText(wrapped, start, end, "end");
        input.focus();
      });
    });
  }

  function getDefaultHeaderConfig() {
    return {
      title: "Final Year Project",
      nav: ["Home", "Team Member", "Project Progress", "Contact Us"]
    };
  }

  function readHeaderConfig() {
    const stored = localStorage.getItem(HEADER_KEY);
    if (!stored) return getDefaultHeaderConfig();
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object") return getDefaultHeaderConfig();
      const nav = Array.isArray(parsed.nav) ? parsed.nav.slice(0, 4) : getDefaultHeaderConfig().nav;
      while (nav.length < 4) nav.push(getDefaultHeaderConfig().nav[nav.length]);
      return {
        title: typeof parsed.title === "string" && parsed.title.trim() ? parsed.title : getDefaultHeaderConfig().title,
        nav: nav.map(function (item, index) {
          const text = typeof item === "string" ? item.trim() : "";
          return text || getDefaultHeaderConfig().nav[index];
        })
      };
    } catch (error) {
      return getDefaultHeaderConfig();
    }
  }

  function applyHeaderConfig() {
    const headerTitle = document.querySelector(".site-title");
    const navLinks = document.querySelectorAll(".nav-list a");
    if (!headerTitle || navLinks.length < 4) return;

    const config = readHeaderConfig();
    headerTitle.textContent = config.title;
    for (let i = 0; i < 4; i += 1) {
      navLinks[i].textContent = config.nav[i];
    }
  }

  function setupHeaderEditor() {
    const headerWrap = document.querySelector(".header-wrap");
    if (!headerWrap) return;

    const authActions = headerWrap.querySelector(".auth-actions");
    if (!authActions) return;

    const navLinks = document.querySelectorAll(".nav-list a");
    const titleEl = document.querySelector(".site-title");
    if (!titleEl || navLinks.length < 4) return;

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn";
    editBtn.id = "headerEditToggleBtn";
    editBtn.textContent = "Edit Header";
    authActions.appendChild(editBtn);

    const exportBtn = document.createElement("button");
    exportBtn.type = "button";
    exportBtn.className = "btn secondary";
    exportBtn.id = "exportSnapshotBtn";
    exportBtn.textContent = "Export Snapshot";
    authActions.appendChild(exportBtn);

    const panel = document.createElement("section");
    panel.id = "headerEditorPanel";
    panel.className = "container card editor-area hidden";
    panel.innerHTML =
      '<h3>Edit Header</h3>' +
      '<label for="headerTitleInput">Website Title</label>' +
      '<input id="headerTitleInput" type="text">' +
      '<label for="headerNav0Input">Navigation 1</label>' +
      '<input id="headerNav0Input" type="text">' +
      '<label for="headerNav1Input">Navigation 2</label>' +
      '<input id="headerNav1Input" type="text">' +
      '<label for="headerNav2Input">Navigation 3</label>' +
      '<input id="headerNav2Input" type="text">' +
      '<label for="headerNav3Input">Navigation 4</label>' +
      '<input id="headerNav3Input" type="text">' +
      '<div class="editor-actions">' +
      '<button id="saveHeaderBtn" class="btn" type="button">Save Header</button>' +
      '<button id="cancelHeaderBtn" class="btn secondary" type="button">Cancel</button>' +
      "</div>" +
      '<p id="headerEditorHint" class="hint"></p>';
    headerWrap.parentElement.insertAdjacentElement("afterend", panel);

    const titleInput = document.getElementById("headerTitleInput");
    const nav0Input = document.getElementById("headerNav0Input");
    const nav1Input = document.getElementById("headerNav1Input");
    const nav2Input = document.getElementById("headerNav2Input");
    const nav3Input = document.getElementById("headerNav3Input");
    const saveBtn = document.getElementById("saveHeaderBtn");
    const cancelBtn = document.getElementById("cancelHeaderBtn");
    const hintEl = document.getElementById("headerEditorHint");

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) === "true";
    }

    function fillInputs() {
      const config = readHeaderConfig();
      titleInput.value = config.title;
      nav0Input.value = config.nav[0];
      nav1Input.value = config.nav[1];
      nav2Input.value = config.nav[2];
      nav3Input.value = config.nav[3];
    }

    function refreshState() {
      const loggedIn = isLoggedIn();
      editBtn.classList.toggle("hidden", !loggedIn);
      exportBtn.classList.toggle("hidden", !loggedIn);
      editBtn.disabled = !loggedIn;
      editBtn.title = loggedIn ? "" : "Please login first";
      exportBtn.disabled = !loggedIn;
      exportBtn.title = loggedIn ? "" : "Please login first";
      setMessage(
        hintEl,
        loggedIn ? "You can edit header title and menu now." : "Please login to edit header.",
        false
      );
      if (!loggedIn) {
        panel.classList.add("hidden");
      }
    }

    function downloadSnapshotFile(snapshot) {
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = SNAPSHOT_FILE_NAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    editBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      fillInputs();
      panel.classList.toggle("hidden");
    });

    saveBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      const newConfig = {
        title: titleInput.value.trim() || getDefaultHeaderConfig().title,
        nav: [
          nav0Input.value.trim() || getDefaultHeaderConfig().nav[0],
          nav1Input.value.trim() || getDefaultHeaderConfig().nav[1],
          nav2Input.value.trim() || getDefaultHeaderConfig().nav[2],
          nav3Input.value.trim() || getDefaultHeaderConfig().nav[3]
        ]
      };
      localStorage.setItem(HEADER_KEY, JSON.stringify(newConfig));
      applyHeaderConfig();
      panel.classList.add("hidden");
      setMessage(hintEl, "Header updated.", false);
    });

    cancelBtn.addEventListener("click", function () {
      panel.classList.add("hidden");
    });

    exportBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      const snapshot = {
        exportedAt: new Date().toISOString(),
        projectInfo: localStorage.getItem(PROJECT_INFO_KEY) || "",
        mainContent: localStorage.getItem(CONTENT_KEY) || "",
        contact: localStorage.getItem(CONTACT_KEY) || "",
        team: (function () {
          const raw = localStorage.getItem(TEAM_KEY);
          if (!raw) return DEFAULT_TEAM;
          try { return JSON.parse(raw); } catch (error) { return DEFAULT_TEAM; }
        })(),
        header: readHeaderConfig(),
        progress: (function () {
          const raw = localStorage.getItem(PROGRESS_KEY);
          if (!raw) return DEFAULT_PROGRESS_DATA;
          try { return JSON.parse(raw); } catch (error) { return DEFAULT_PROGRESS_DATA; }
        })()
      };
      downloadSnapshotFile(snapshot);
      setMessage(hintEl, "Snapshot exported. Upload this JSON with your website files.", false);
    });

    applyHeaderConfig();
    refreshState();
    window.addEventListener("storage", applyHeaderConfig);
    window.addEventListener("storage", refreshState);
    window.addEventListener("focus", refreshState);
    window.addEventListener("auth-changed", refreshState);
  }

  function setupLoginPage() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const messageEl = document.getElementById("loginMessage");
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "admin" && password === "fypP@ssw0rd") {
        localStorage.setItem(AUTH_KEY, "true");
        window.dispatchEvent(new Event("auth-changed"));
        setMessage(messageEl, "Login successful. Redirecting to home page...", false);
        setTimeout(function () {
          window.location.href = "index.html";
        }, 800);
      } else {
        setMessage(messageEl, "Invalid username or password.", true);
      }
    });
  }

  function setupHomePage() {
    const contentDisplay = document.getElementById("mainContentDisplay");
    if (!contentDisplay) return;

    const projectInfoDisplay = document.getElementById("projectInfoDisplay");
    const projectInfoEditBtn = document.getElementById("projectInfoEditBtn");
    const projectInfoEditorArea = document.getElementById("projectInfoEditorArea");
    const projectInfoHint = document.getElementById("projectInfoHint");
    const projectInfoInput = document.getElementById("projectInfoInput");
    const saveProjectInfoBtn = document.getElementById("saveProjectInfoBtn");
    const cancelProjectInfoBtn = document.getElementById("cancelProjectInfoBtn");

    const editToggleBtn = document.getElementById("editToggleBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const editorArea = document.getElementById("editorArea");
    const editorHint = document.getElementById("editorHint");
    const contentInput = document.getElementById("mainContentInput");
    const saveBtn = document.getElementById("saveContentBtn");
    const cancelBtn = document.getElementById("cancelEditBtn");

    const savedContent = localStorage.getItem(CONTENT_KEY);
    if (savedContent) {
      contentDisplay.innerHTML = markupToHtml(savedContent);
    }
    const savedProjectInfo = localStorage.getItem(PROJECT_INFO_KEY);
    if (savedProjectInfo && projectInfoDisplay) {
      projectInfoDisplay.innerHTML = markupToHtml(savedProjectInfo);
    }

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) === "true";
    }

    function updateAuthUI() {
      const loggedIn = isLoggedIn();
      if (projectInfoEditBtn) {
        projectInfoEditBtn.classList.toggle("hidden", !loggedIn);
        projectInfoEditBtn.disabled = !loggedIn;
        projectInfoEditBtn.title = loggedIn ? "" : "Please login first";
      }
      editToggleBtn.classList.toggle("hidden", !loggedIn);
      editToggleBtn.disabled = !loggedIn;
      editToggleBtn.title = loggedIn ? "" : "Please login first";
      logoutBtn.classList.toggle("hidden", !loggedIn);
      setMessage(
        projectInfoHint,
        loggedIn ? "You can edit project information now." : "Please login to edit project information.",
        false
      );
      setMessage(
        editorHint,
        loggedIn ? "You can edit the main page details now." : "Please login to edit main page details.",
        false
      );
      if (!loggedIn && projectInfoEditorArea) {
        projectInfoEditorArea.classList.add("hidden");
      }
      if (!loggedIn) {
        editorArea.classList.add("hidden");
      }
    }

    if (projectInfoEditBtn) {
      projectInfoEditBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        projectInfoInput.value = stripHtmlToText(projectInfoDisplay.innerHTML);
        projectInfoEditorArea.classList.toggle("hidden");
      });
    }

    if (saveProjectInfoBtn) {
      saveProjectInfoBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        const newProjectInfo = projectInfoInput.value.trim();
        if (newProjectInfo.length === 0) {
          setMessage(projectInfoHint, "Project information cannot be empty.", true);
          return;
        }
        localStorage.setItem(PROJECT_INFO_KEY, newProjectInfo);
        projectInfoDisplay.innerHTML = markupToHtml(newProjectInfo);
        projectInfoEditorArea.classList.add("hidden");
        setMessage(projectInfoHint, "Project information updated.", false);
      });
    }

    if (cancelProjectInfoBtn) {
      cancelProjectInfoBtn.addEventListener("click", function () {
        projectInfoEditorArea.classList.add("hidden");
      });
    }

    editToggleBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      contentInput.value = stripHtmlToText(contentDisplay.innerHTML);
      editorArea.classList.toggle("hidden");
    });

    saveBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      const newContent = contentInput.value.trim();
      if (newContent.length === 0) {
        setMessage(editorHint, "Content cannot be empty.", true);
        return;
      }
      localStorage.setItem(CONTENT_KEY, newContent);
      contentDisplay.innerHTML = markupToHtml(newContent);
      editorArea.classList.add("hidden");
      setMessage(editorHint, "Main content updated.", false);
    });

    cancelBtn.addEventListener("click", function () {
      editorArea.classList.add("hidden");
    });

    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event("auth-changed"));
      updateAuthUI();
    });

    updateAuthUI();
  }

  function setupContactPage() {
    const contactDisplay = document.getElementById("contactDisplayText");
    if (!contactDisplay) return;

    const editToggleBtn = document.getElementById("contactEditToggleBtn");
    const logoutBtn = document.getElementById("contactLogoutBtn");
    const editorArea = document.getElementById("contactEditorArea");
    const editorHint = document.getElementById("contactEditorHint");
    const contactInput = document.getElementById("contactInput");
    const saveBtn = document.getElementById("saveContactBtn");
    const cancelBtn = document.getElementById("cancelContactBtn");

    const savedContact = localStorage.getItem(CONTACT_KEY);
    if (savedContact) {
      contactDisplay.innerHTML = markupToHtml(savedContact);
    }

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) === "true";
    }

    function updateAuthUI() {
      const loggedIn = isLoggedIn();
      editToggleBtn.classList.toggle("hidden", !loggedIn);
      editToggleBtn.disabled = !loggedIn;
      editToggleBtn.title = loggedIn ? "" : "Please login first";
      logoutBtn.classList.toggle("hidden", !loggedIn);
      setMessage(
        editorHint,
        loggedIn ? "You can edit contact details now." : "Please login to edit contact details.",
        false
      );
      if (!loggedIn) {
        editorArea.classList.add("hidden");
      }
    }

    editToggleBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      contactInput.value = stripHtmlToText(contactDisplay.innerHTML);
      editorArea.classList.toggle("hidden");
    });

    saveBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      const newContact = contactInput.value.trim();
      if (newContact.length === 0) {
        setMessage(editorHint, "Contact content cannot be empty.", true);
        return;
      }

      localStorage.setItem(CONTACT_KEY, newContact);
      contactDisplay.innerHTML = markupToHtml(newContact);
      editorArea.classList.add("hidden");
      setMessage(editorHint, "Contact details updated.", false);
    });

    cancelBtn.addEventListener("click", function () {
      editorArea.classList.add("hidden");
    });

    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new Event("auth-changed"));
      updateAuthUI();
    });

    updateAuthUI();
  }

  function setupProgressPage() {
    const progressContentDisplay = document.getElementById("progressContentDisplay");
    if (!progressContentDisplay) return;

    const editToggleBtn = document.getElementById("progressEditToggleBtn");
    const editorArea = document.getElementById("progressEditorArea");
    const editorFields = document.getElementById("progressEditorFields");
    const editorHint = document.getElementById("progressEditorHint");
    const saveBtn = document.getElementById("saveProgressBtn");
    const cancelBtn = document.getElementById("cancelProgressBtn");

    function cloneDefaultProgress() {
      return JSON.parse(JSON.stringify(DEFAULT_PROGRESS_DATA));
    }

    function readProgressData() {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (!stored) return cloneDefaultProgress();
      try {
        const parsed = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object") return cloneDefaultProgress();
        if (!Array.isArray(parsed.primary) || !Array.isArray(parsed.final)) return cloneDefaultProgress();
        return {
          note: typeof parsed.note === "string" ? parsed.note : DEFAULT_PROGRESS_DATA.note,
          primary: parsed.primary.map(function (row, index) {
            const def = DEFAULT_PROGRESS_DATA.primary[index] || { task: "Task", oldDeadline: "", deadline: "" };
            return {
              task: (row && typeof row.task === "string" && row.task.trim()) ? row.task : def.task,
              oldDeadline: (row && typeof row.oldDeadline === "string") ? row.oldDeadline : def.oldDeadline,
              deadline: (row && typeof row.deadline === "string") ? row.deadline : def.deadline
            };
          }).slice(0, DEFAULT_PROGRESS_DATA.primary.length),
          final: parsed.final.map(function (row, index) {
            const def = DEFAULT_PROGRESS_DATA.final[index] || { task: "Task", deadline: "" };
            return {
              task: (row && typeof row.task === "string" && row.task.trim()) ? row.task : def.task,
              deadline: (row && typeof row.deadline === "string") ? row.deadline : def.deadline
            };
          }).slice(0, DEFAULT_PROGRESS_DATA.final.length)
        };
      } catch (error) {
        return cloneDefaultProgress();
      }
    }

    function createCellText(cell, text) {
      cell.textContent = text;
    }

    function renderProgressDisplay(data) {
      progressContentDisplay.innerHTML = "";

      const note = document.createElement("p");
      note.className = "hint";
      note.textContent = data.note;
      progressContentDisplay.appendChild(note);

      const wrap1 = document.createElement("div");
      wrap1.className = "table-wrap";
      const table1 = document.createElement("table");
      table1.className = "progress-table";
      table1.innerHTML = "<thead><tr><th>Task</th><th>Deadline (for students to submit their works)</th></tr></thead>";
      const body1 = document.createElement("tbody");
      data.primary.forEach(function (row) {
        const tr = document.createElement("tr");
        const tdTask = document.createElement("td");
        createCellText(tdTask, row.task);

        const tdDeadline = document.createElement("td");
        if (row.oldDeadline && row.oldDeadline.trim()) {
          const oldSpan = document.createElement("span");
          oldSpan.className = "old-date";
          oldSpan.textContent = row.oldDeadline;
          tdDeadline.appendChild(oldSpan);

          const newSpan = document.createElement("span");
          newSpan.className = "new-date";
          newSpan.textContent = row.deadline;
          tdDeadline.appendChild(newSpan);
        } else {
          createCellText(tdDeadline, row.deadline);
        }

        tr.appendChild(tdTask);
        tr.appendChild(tdDeadline);
        body1.appendChild(tr);
      });
      table1.appendChild(body1);
      wrap1.appendChild(table1);
      progressContentDisplay.appendChild(wrap1);

      const wrap2 = document.createElement("div");
      wrap2.className = "table-wrap";
      const table2 = document.createElement("table");
      table2.className = "progress-table";
      table2.innerHTML = "<thead><tr><th>Task</th><th>Deadline</th></tr></thead>";
      const body2 = document.createElement("tbody");
      data.final.forEach(function (row) {
        const tr = document.createElement("tr");
        const tdTask = document.createElement("td");
        const tdDeadline = document.createElement("td");
        createCellText(tdTask, row.task);
        createCellText(tdDeadline, row.deadline);
        tr.appendChild(tdTask);
        tr.appendChild(tdDeadline);
        body2.appendChild(tr);
      });
      table2.appendChild(body2);
      wrap2.appendChild(table2);
      progressContentDisplay.appendChild(wrap2);
    }

    function renderProgressEditor(data) {
      editorFields.innerHTML = "";

      const noteLabel = document.createElement("label");
      noteLabel.setAttribute("for", "progress-note-input");
      noteLabel.textContent = "Page Note";
      const noteInput = document.createElement("input");
      noteInput.id = "progress-note-input";
      noteInput.type = "text";
      noteInput.value = data.note;
      editorFields.appendChild(noteLabel);
      editorFields.appendChild(noteInput);

      const section1Title = document.createElement("h4");
      section1Title.textContent = "Main Deadlines";
      section1Title.className = "progress-editor-title";
      editorFields.appendChild(section1Title);

      data.primary.forEach(function (row, index) {
        const block = document.createElement("div");
        block.className = "progress-editor-item card";
        block.innerHTML =
          "<h4>Item " + (index + 1) + "</h4>" +
          '<label for="progress-primary-task-' + index + '">Task</label>' +
          '<input id="progress-primary-task-' + index + '" type="text">' +
          '<label for="progress-primary-old-' + index + '">Old Deadline (optional)</label>' +
          '<input id="progress-primary-old-' + index + '" type="text">' +
          '<label for="progress-primary-deadline-' + index + '">Deadline</label>' +
          '<input id="progress-primary-deadline-' + index + '" type="text">';
        editorFields.appendChild(block);

        document.getElementById("progress-primary-task-" + index).value = row.task;
        document.getElementById("progress-primary-old-" + index).value = row.oldDeadline;
        document.getElementById("progress-primary-deadline-" + index).value = row.deadline;
      });

      const section2Title = document.createElement("h4");
      section2Title.textContent = "Final Deadlines";
      section2Title.className = "progress-editor-title";
      editorFields.appendChild(section2Title);

      data.final.forEach(function (row, index) {
        const block = document.createElement("div");
        block.className = "progress-editor-item card";
        block.innerHTML =
          "<h4>Final Item " + (index + 1) + "</h4>" +
          '<label for="progress-final-task-' + index + '">Task</label>' +
          '<input id="progress-final-task-' + index + '" type="text">' +
          '<label for="progress-final-deadline-' + index + '">Deadline</label>' +
          '<input id="progress-final-deadline-' + index + '" type="text">';
        editorFields.appendChild(block);

        document.getElementById("progress-final-task-" + index).value = row.task;
        document.getElementById("progress-final-deadline-" + index).value = row.deadline;
      });
    }

    function collectProgressFromEditor() {
      const noteInput = document.getElementById("progress-note-input");
      const data = {
        note: (noteInput && noteInput.value.trim()) ? noteInput.value.trim() : DEFAULT_PROGRESS_DATA.note,
        primary: [],
        final: []
      };

      for (let i = 0; i < DEFAULT_PROGRESS_DATA.primary.length; i += 1) {
        const task = document.getElementById("progress-primary-task-" + i).value.trim();
        const oldDeadline = document.getElementById("progress-primary-old-" + i).value.trim();
        const deadline = document.getElementById("progress-primary-deadline-" + i).value.trim();
        data.primary.push({
          task: task || DEFAULT_PROGRESS_DATA.primary[i].task,
          oldDeadline: oldDeadline,
          deadline: deadline || DEFAULT_PROGRESS_DATA.primary[i].deadline
        });
      }

      for (let i = 0; i < DEFAULT_PROGRESS_DATA.final.length; i += 1) {
        const task = document.getElementById("progress-final-task-" + i).value.trim();
        const deadline = document.getElementById("progress-final-deadline-" + i).value.trim();
        data.final.push({
          task: task || DEFAULT_PROGRESS_DATA.final[i].task,
          deadline: deadline || DEFAULT_PROGRESS_DATA.final[i].deadline
        });
      }
      return data;
    }

    let progressData = readProgressData();
    renderProgressDisplay(progressData);

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) === "true";
    }

    function updateAuthUI() {
      const loggedIn = isLoggedIn();
      editToggleBtn.classList.toggle("hidden", !loggedIn);
      editToggleBtn.disabled = !loggedIn;
      editToggleBtn.title = loggedIn ? "" : "Please login first";
      setMessage(
        editorHint,
        loggedIn ? "You can edit project progress now." : "Please login to edit project progress.",
        false
      );
      if (!loggedIn) {
        editorArea.classList.add("hidden");
      }
    }

    editToggleBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      progressData = readProgressData();
      renderProgressEditor(progressData);
      editorArea.classList.toggle("hidden");
    });

    saveBtn.addEventListener("click", function () {
      if (!isLoggedIn()) return;
      progressData = collectProgressFromEditor();
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
      renderProgressDisplay(progressData);
      editorArea.classList.add("hidden");
      setMessage(editorHint, "Project progress updated.", false);
    });

    cancelBtn.addEventListener("click", function () {
      editorArea.classList.add("hidden");
    });

    updateAuthUI();
    window.addEventListener("auth-changed", updateAuthUI);
    window.addEventListener("focus", updateAuthUI);
  }

  function setupTeamPage() {
    const teamList = document.getElementById("teamList");
    if (!teamList) return;

    const editToggleBtn = document.getElementById("teamEditToggleBtn");
    const logoutBtn = document.getElementById("teamLogoutBtn");
    const editorArea = document.getElementById("teamEditorArea");
    const editorFields = document.getElementById("teamEditorFields");
    const saveBtn = document.getElementById("saveTeamBtn");
    const cancelBtn = document.getElementById("cancelTeamBtn");
    const editorHint = document.getElementById("teamEditorHint");
    const memberInfoMentorText = document.getElementById("memberInfoMentorText");
    const memberInfoTeamList = document.getElementById("memberInfoTeamList");
    const memberInfoEditBtn = document.getElementById("memberInfoEditBtn");
    const memberInfoEditorArea = document.getElementById("memberInfoEditorArea");
    const memberInfoMentorInput = document.getElementById("memberInfoMentorInput");
    const memberInfoTeamInput = document.getElementById("memberInfoTeamInput");
    const saveMemberInfoBtn = document.getElementById("saveMemberInfoBtn");
    const cancelMemberInfoBtn = document.getElementById("cancelMemberInfoBtn");
    const memberInfoHint = document.getElementById("memberInfoHint");
    const uploadedPhotoMap = {};

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) === "true";
    }

    function isCheungMember(member) {
      return (member.name || "").indexOf("CHEUNG CHUN HANG") !== -1;
    }

    function isChungMember(member) {
      return (member.name || "").indexOf("CHUNG YUE CHEE") !== -1;
    }

    function isKwokMember(member) {
      return (member.name || "").indexOf("KWOK WING HING") !== -1;
    }

    function isLauMember(member) {
      return (member.name || "").indexOf("LAU CHIN KEI") !== -1;
    }

    function isLeeMember(member) {
      return (member.name || "").indexOf("LEE WAI WA") !== -1;
    }

    function isGenericMemberDescription(description, member) {
      const oldDesc = (description || "").toLowerCase();
      if (!oldDesc || oldDesc === "final year project team member.") return true;
      if (isCheungMember(member)) {
        return oldDesc.indexOf("apk") !== -1 || oldDesc.indexOf("ios version") !== -1;
      }
      return false;
    }

    function getMemberDescKey(member) {
      if ((member.role || "").toLowerCase().includes("mentor")) return "team_desc_mentor";
      if (isCheungMember(member)) return "team_desc_cheung";
      if (isChungMember(member)) return "team_desc_chung";
      if (isKwokMember(member)) return "team_desc_kwok";
      if (isLauMember(member)) return "team_desc_lau";
      if (isLeeMember(member)) return "team_desc_lee";
      return "team_desc_member";
    }

    function getMemberRoleKey(member) {
      if ((member.role || "").toLowerCase().includes("mentor")) return "team_role_mentor";
      if (isCheungMember(member)) return "team_role_application";
      if (isChungMember(member)) return "team_role_ai_director";
      if (isKwokMember(member)) return "team_role_interview_director";
      if (isLauMember(member)) return "team_role_cyber_security_director";
      if (isLeeMember(member)) return "team_role_design_web3_director";
      return "team_role_member";
    }

    function syncFeaturedTeamMember(members, isMatch) {
      const featuredDefault = DEFAULT_TEAM.find(isMatch);
      if (!featuredDefault) return { members: members, changed: false };
      let changed = false;
      const synced = members.map(function (member) {
        if (!isMatch(member)) return member;
        const looksGeneric = isGenericMemberDescription(member.description, member);
        const roleNeedsUpdate =
          (member.role || "").toLowerCase() !== (featuredDefault.role || "").toLowerCase();
        const idNeedsUpdate = !(member.id || "").trim() && (featuredDefault.id || "").trim();
        if (!looksGeneric && !roleNeedsUpdate && !idNeedsUpdate) return member;
        changed = true;
        return Object.assign({}, member, {
          name: parseMemberIdentity(featuredDefault).name,
          id: (member.id || "").trim() || featuredDefault.id || "",
          description: looksGeneric ? featuredDefault.description : member.description,
          role: roleNeedsUpdate ? featuredDefault.role : member.role
        });
      });
      return { members: synced, changed: changed };
    }

    function syncFeaturedTeamMembers(members) {
      let synced = members;
      let changed = false;
      [isCheungMember, isChungMember, isKwokMember, isLauMember, isLeeMember].forEach(function (isMatch) {
        const result = syncFeaturedTeamMember(synced, isMatch);
        synced = result.members;
        if (result.changed) changed = true;
      });
      if (changed) {
        localStorage.setItem(TEAM_KEY, JSON.stringify(synced));
      }
      return synced;
    }

    function readTeamMembers() {
      const stored = localStorage.getItem(TEAM_KEY);
      if (!stored) return DEFAULT_TEAM.slice();
      try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed) || parsed.length !== DEFAULT_TEAM.length) {
          localStorage.removeItem(TEAM_KEY);
          return DEFAULT_TEAM.slice();
        }
        const synced = reorderTeamMembers(syncFeaturedTeamMembers(parsed));
        localStorage.setItem(TEAM_KEY, JSON.stringify(synced));
        return synced;
      } catch (error) {
        return DEFAULT_TEAM.slice();
      }
    }


    function applyTeamPageLang() {
      if (typeof window.fypApplyLang === "function") {
        window.fypApplyLang();
      }
    }

    function renderTeamCards(members) {
      if (!localStorage.getItem(TEAM_KEY) && teamList.querySelector(".team-card")) {
        applyTeamPageLang();
        return;
      }
      teamList.innerHTML = "";
      const orderedMembers = members.slice().sort(function (a, b) {
        const aIsMentor = (a.role || "").toLowerCase().includes("mentor") ? 1 : 0;
        const bIsMentor = (b.role || "").toLowerCase().includes("mentor") ? 1 : 0;
        return bIsMentor - aIsMentor;
      });

      orderedMembers.forEach(function (member) {
        const card = document.createElement("article");
        card.className = "team-card";
        if ((member.role || "").toLowerCase().includes("mentor")) {
          card.classList.add("mentor-card");
        }
        card.style.position = "relative";

        const img = document.createElement("img");
        img.className = "team-photo";
        img.src = member.photo || "https://via.placeholder.com/320x320.png?text=Member";
        img.alt = member.name + " photo";

        const name = document.createElement("h3");
        name.textContent = formatMemberCardName(member);

        const role = document.createElement("p");
        role.className = "team-role";
        if ((member.role || "").toLowerCase().includes("mentor")) {
          role.classList.add("mentor-role");
        }
        role.setAttribute("data-i18n", getMemberRoleKey(member));
        role.textContent = member.role;

        const desc = document.createElement("p");
        desc.setAttribute("data-i18n", getMemberDescKey(member));
        desc.textContent = member.description;

        if ((member.role || "").toLowerCase().includes("mentor")) {
          const badge = document.createElement("span");
          badge.className = "mentor-badge";
          badge.setAttribute("data-i18n", "team_badge_mentor");
          badge.textContent = "MENTOR";
          card.appendChild(badge);
        }

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(role);
        card.appendChild(desc);
        teamList.appendChild(card);
      });
      applyTeamPageLang();
    }

    function appendMemberInfoListItem(listEl, member) {
      const identity = parseMemberIdentity(member);
      const li = document.createElement("li");
      const nameSpan = document.createElement("span");
      nameSpan.className = "member-info-name";
      nameSpan.textContent = identity.name;
      li.appendChild(nameSpan);
      if (identity.id) {
        const idSpan = document.createElement("span");
        idSpan.className = "member-info-id";
        idSpan.textContent = " (" + identity.id + ")";
        li.appendChild(idSpan);
      }
      listEl.appendChild(li);
    }

    function renderMemberInfo(members) {
      if (!memberInfoMentorText || !memberInfoTeamList) return;
      const mentor = members.find(isMentorMember) || getDefaultMentor();
      const teamMembers = getDefaultStudents().map(function (def) {
        const defIdentity = parseMemberIdentity(def);
        const found = members.find(function (member) {
          if (isMentorMember(member)) return false;
          const identity = parseMemberIdentity(member);
          if (defIdentity.id && identity.id && identity.id === defIdentity.id) return true;
          return identity.name.toUpperCase() === defIdentity.name.toUpperCase();
        });
        return found ? Object.assign({}, def, found, { id: defIdentity.id }) : def;
      });

      memberInfoMentorText.textContent = mentor ? parseMemberIdentity(mentor).name : "N/A";
      memberInfoTeamList.innerHTML = "";
      teamMembers.forEach(function (member) {
        appendMemberInfoListItem(memberInfoTeamList, member);
      });
    }

    function openMemberInfoEditor(members) {
      const mentor = members.find(function (member) {
        return (member.role || "").toLowerCase().includes("mentor");
      });
      const teamMembers = members.filter(function (member) {
        return !(member.role || "").toLowerCase().includes("mentor");
      });
      memberInfoMentorInput.value = mentor ? mentor.name : "";
      memberInfoTeamInput.value = teamMembers.map(function (member) {
        return formatMemberInfoLine(member);
      }).join("\n");
      memberInfoEditorArea.classList.remove("hidden");
    }

    function saveMemberInfo(members) {
      const mentorName = memberInfoMentorInput.value.trim() || "Professor YIU SIU MING";
      const lines = memberInfoTeamInput.value
        .split("\n")
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line.length > 0; });

      const desiredCount = DEFAULT_TEAM.length - 1;
      const teamNames = lines.slice(0, desiredCount);
      while (teamNames.length < desiredCount) {
        teamNames.push("Team Member " + (teamNames.length + 1));
      }

      const oldMentor = members.find(function (member) {
        return (member.role || "").toLowerCase().includes("mentor");
      }) || DEFAULT_TEAM[DEFAULT_TEAM.length - 1];
      const oldTeamMembers = members.filter(function (member) {
        return !(member.role || "").toLowerCase().includes("mentor");
      });

      const updated = [];

      for (let i = 0; i < desiredCount; i += 1) {
        const defaultMember = getDefaultStudents()[i] || DEFAULT_TEAM[i] || {};
        const baseMember =
          oldTeamMembers.find(function (member) {
            const identity = parseMemberIdentity(member);
            const defIdentity = parseMemberIdentity(defaultMember);
            if (defIdentity.id && identity.id && identity.id === defIdentity.id) return true;
            return identity.name.toUpperCase() === defIdentity.name.toUpperCase();
          }) || defaultMember;
        const parsed = parseMemberIdentity({
          name: teamNames[i],
          id: baseMember.id || defaultMember.id
        });
        const defaultParsed = parseMemberIdentity(defaultMember);
        updated.push({
          name: parsed.name || defaultParsed.name,
          id: parsed.id || defaultParsed.id || "",
          role: baseMember.role || defaultMember.role || "Team Member",
          photo: baseMember.photo || defaultMember.photo || "https://via.placeholder.com/320x320.png?text=Member+" + (i + 1),
          description: baseMember.description || defaultMember.description || "Final year project team member."
        });
      }

      updated.push({
        name: mentorName,
        role: "Mentor",
        photo: oldMentor.photo || getDefaultMentor().photo || "IMG/men1.png",
        description: oldMentor.description || getDefaultMentor().description || "Project mentor and academic advisor."
      });

      localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
      return updated;
    }

    function renderTeamEditor(members) {
      editorFields.innerHTML = "";
      for (const key in uploadedPhotoMap) {
        delete uploadedPhotoMap[key];
      }
      members.forEach(function (member, index) {
        const block = document.createElement("div");
        block.className = "team-editor-item card";

        const title = document.createElement("h3");
        title.textContent = "Member " + (index + 1);

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Name";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = "member-name-" + index;
        nameInput.value = member.name || "";

        const roleLabel = document.createElement("label");
        roleLabel.textContent = "Role";
        const roleInput = document.createElement("input");
        roleInput.type = "text";
        roleInput.id = "member-role-" + index;
        roleInput.value = member.role || "";

        const photoLabel = document.createElement("label");
        photoLabel.textContent = "Photo URL";
        const photoInput = document.createElement("input");
        photoInput.type = "text";
        photoInput.id = "member-photo-" + index;
        photoInput.value = member.photo || "";

        const uploadLabel = document.createElement("label");
        uploadLabel.textContent = "Upload Photo";
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.id = "member-photo-upload-" + index;
        uploadInput.accept = "image/*";

        const preview = document.createElement("img");
        preview.id = "member-photo-preview-" + index;
        preview.className = "upload-preview";
        preview.alt = "Preview for " + (member.name || ("Member " + (index + 1)));
        preview.src = member.photo || "https://via.placeholder.com/320x320.png?text=Member+" + (index + 1);

        uploadInput.addEventListener("change", function () {
          const file = uploadInput.files && uploadInput.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function () {
            if (typeof reader.result === "string") {
              uploadedPhotoMap[index] = reader.result;
              preview.src = reader.result;
            }
          };
          reader.readAsDataURL(file);
        });

        const descLabel = document.createElement("label");
        descLabel.textContent = "Description";
        const descInput = document.createElement("textarea");
        descInput.id = "member-description-" + index;
        descInput.rows = 4;
        descInput.value = member.description || "";

        block.appendChild(title);
        block.appendChild(nameLabel);
        block.appendChild(nameInput);
        block.appendChild(roleLabel);
        block.appendChild(roleInput);
        block.appendChild(photoLabel);
        block.appendChild(photoInput);
        block.appendChild(uploadLabel);
        block.appendChild(uploadInput);
        block.appendChild(preview);
        block.appendChild(descLabel);
        block.appendChild(descInput);
        editorFields.appendChild(block);
      });
    }

    function collectEditedMembers() {
      const edited = [];
      for (let i = 0; i < DEFAULT_TEAM.length; i += 1) {
        const name = document.getElementById("member-name-" + i).value.trim();
        const role = document.getElementById("member-role-" + i).value.trim();
        const photo = document.getElementById("member-photo-" + i).value.trim();
        const uploadedPhoto = uploadedPhotoMap[i];
        const description = document.getElementById("member-description-" + i).value.trim();
        const defaultMember = DEFAULT_TEAM[i] || {};
        const parsed = parseMemberIdentity({ name: name, id: defaultMember.id });
        const isMentor = (role || defaultMember.role || "").toLowerCase().includes("mentor");
        edited.push({
          name: parsed.name || (isMentor ? name : "Member " + (i + 1)),
          id: isMentor ? "" : parsed.id || defaultMember.id || "",
          role: role || defaultMember.role || "Team Member",
          photo: uploadedPhoto || photo || defaultMember.photo || "https://via.placeholder.com/320x320.png?text=Member+" + (i + 1),
          description: description || defaultMember.description || "No description provided yet."
        });
      }
      return edited;
    }

    function updateAuthUI() {
      const loggedIn = isLoggedIn();
      if (editToggleBtn) {
        editToggleBtn.classList.toggle("hidden", !loggedIn);
        editToggleBtn.disabled = !loggedIn;
        editToggleBtn.title = loggedIn ? "" : "Please login first";
      }
      if (memberInfoEditBtn) {
        memberInfoEditBtn.classList.toggle("hidden", !loggedIn);
        memberInfoEditBtn.disabled = !loggedIn;
        memberInfoEditBtn.title = loggedIn ? "" : "Please login first";
      }
      if (logoutBtn) {
        logoutBtn.classList.toggle("hidden", !loggedIn);
      }
      setMessage(
        memberInfoHint,
        loggedIn ? "You can edit member information now." : "Please login to edit member information.",
        false
      );
      setMessage(
        editorHint,
        loggedIn ? "You can edit all team members now." : "Please login to edit team members.",
        false
      );
      if (!loggedIn) {
        if (memberInfoEditorArea) memberInfoEditorArea.classList.add("hidden");
        if (editorArea) editorArea.classList.add("hidden");
      }
    }

    let members = readTeamMembers();
    renderTeamCards(members);
    renderMemberInfo(members);
    if (editorFields) {
      renderTeamEditor(members);
    }

    document.addEventListener("fyp-lang-change", applyTeamPageLang);

    if (editToggleBtn && editorArea && saveBtn && cancelBtn) {
      editToggleBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        members = readTeamMembers();
        renderTeamEditor(members);
        editorArea.classList.toggle("hidden");
      });

      saveBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        const edited = collectEditedMembers();
        localStorage.setItem(TEAM_KEY, JSON.stringify(edited));
        members = edited;
        renderTeamCards(members);
        renderMemberInfo(members);
        editorArea.classList.add("hidden");
        setMessage(editorHint, "Team member information updated.", false);
      });

      cancelBtn.addEventListener("click", function () {
        editorArea.classList.add("hidden");
      });
    }

    if (memberInfoEditBtn) {
      memberInfoEditBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        members = readTeamMembers();
        openMemberInfoEditor(members);
      });
    }

    if (saveMemberInfoBtn) {
      saveMemberInfoBtn.addEventListener("click", function () {
        if (!isLoggedIn()) return;
        members = saveMemberInfo(readTeamMembers());
        renderTeamCards(members);
        renderMemberInfo(members);
        renderTeamEditor(members);
        memberInfoEditorArea.classList.add("hidden");
        setMessage(memberInfoHint, "Member information updated.", false);
      });
    }

    if (cancelMemberInfoBtn) {
      cancelMemberInfoBtn.addEventListener("click", function () {
        memberInfoEditorArea.classList.add("hidden");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem(AUTH_KEY);
        window.dispatchEvent(new Event("auth-changed"));
        updateAuthUI();
      });
    }

    updateAuthUI();
  }

  setupHeaderEditor();
  setupFormatButtons();
  setupLoginPage();
  setupHomePage();
  setupProgressPage();
  setupContactPage();
  setupTeamPage();
})();
