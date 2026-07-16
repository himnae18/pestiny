(function () {
  "use strict";

  const STORAGE_KEY = "moon-fortune-box-v1";
  const initialState = { users: [], sessionUserId: null, records: {} };
  let state = loadState();
  let currentFortune = null;
  let currentCompatibility = null;
  let calendarCursor = new Date();
  let selectedDateKey = todayKey();
  let confirmAction = null;
  let toastTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function cloneInitialState() {
    return JSON.parse(JSON.stringify(initialState));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneInitialState();
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        sessionUserId: parsed.sessionUserId || null,
        records: parsed.records && typeof parsed.records === "object" ? parsed.records : {}
      };
    } catch (error) {
      console.warn("저장 데이터를 읽지 못했습니다.", error);
      return cloneInitialState();
    }
  }

  function persistState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentUser() {
    return state.users.find((user) => user.id === state.sessionUserId) || null;
  }

  function userRecords(create = false) {
    const user = currentUser();
    if (!user) return null;
    if (create && !state.records[user.id]) state.records[user.id] = {};
    return state.records[user.id] || {};
  }

  function dateRecord(dateKey, create = false) {
    const records = userRecords(create);
    if (!records) return null;
    if (create && !records[dateKey]) records[dateKey] = { entries: [], memo: "" };
    const record = records[dateKey];
    if (record && !Array.isArray(record.entries)) record.entries = [];
    if (record && typeof record.memo !== "string") record.memo = "";
    return record || null;
  }

  function todayKey() {
    return formatDateKey(new Date());
  }

  function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatKoreanDate(dateKey, includeWeekday = true) {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric", month: "long", day: "numeric", ...(includeWeekday ? { weekday: "short" } : {})
    }).format(date);
  }

  function randomItem(list) {
    if (!Array.isArray(list) || list.length === 0) return null;
    if (window.crypto && window.crypto.getRandomValues) {
      const buffer = new Uint32Array(1);
      window.crypto.getRandomValues(buffer);
      return list[buffer[0] % list.length];
    }
    return list[Math.floor(Math.random() * list.length)];
  }

  async function hashPassword(value) {
    if (window.crypto && window.crypto.subtle) {
      const data = new TextEncoder().encode(value);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    let hash = 5381;
    for (let index = 0; index < value.length; index += 1) hash = (hash * 33) ^ value.charCodeAt(index);
    return `fallback-${hash >>> 0}`;
  }

  function uid(prefix) {
    if (window.crypto && window.crypto.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function routeTo(route, updateHash = true) {
    const validRoutes = ["home", "fortune", "compatibility", "calendar", "more"];
    const nextRoute = validRoutes.includes(route) ? route : "home";
    $$(".view").forEach((view) => view.classList.toggle("is-active", view.dataset.view === nextRoute));
    $$(".bottom-nav button").forEach((button) => button.classList.toggle("is-active", button.dataset.route === nextRoute));
    if (updateHash) history.replaceState(null, "", nextRoute === "home" ? "#home" : `#${nextRoute}`);
    if (nextRoute === "calendar") renderCalendar();
    if (nextRoute === "more") renderAccount();
    if (nextRoute === "home") renderTodayRecords();
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#app").focus({ preventScroll: true });
  }

  function renderTodayRecords() {
    const container = $("#home-today-records");
    const user = currentUser();
    if (!user) {
      container.className = "empty-state compact";
      container.innerHTML = "<span aria-hidden=\"true\">☁</span><p>로그인하면 오늘의 결과가 여기에 모여요.</p>";
      return;
    }
    const record = dateRecord(todayKey());
    if (!record || record.entries.length === 0) {
      container.className = "empty-state compact";
      container.innerHTML = "<span aria-hidden=\"true\">☁</span><p>아직 오늘 저장한 결과가 없어요.</p>";
      return;
    }
    container.className = "home-record-list";
    container.innerHTML = record.entries.slice(-3).reverse().map((entry) => {
      const icon = entry.type === "fortune" ? "✦" : "♡";
      const label = entry.type === "fortune" ? "운세" : "궁합";
      return `<div class="home-record-item"><span aria-hidden="true">${icon}</span><div><strong>${escapeHtml(entry.title)}</strong><small>${label} · ${escapeHtml(entry.summary || "기록")}</small></div></div>`;
    }).join("");
  }

  function renderAccount() {
    const user = currentUser();
    $("#logged-out-panel").hidden = Boolean(user);
    $("#logged-in-panel").hidden = !user;
    if (!user) return;

    $("#profile-avatar").textContent = user.nickname.trim().charAt(0) || "달";
    $("#profile-nickname").textContent = user.nickname;
    $("#profile-email").textContent = user.email;

    const records = Object.values(userRecords() || {});
    const entries = records.flatMap((record) => Array.isArray(record.entries) ? record.entries : []);
    $("#stat-fortunes").textContent = entries.filter((entry) => entry.type === "fortune").length;
    $("#stat-matches").textContent = entries.filter((entry) => entry.type === "compatibility").length;
    $("#stat-memos").textContent = records.filter((record) => record.memo && record.memo.trim()).length;
  }

  function drawFortune() {
    const placeholder = $("#fortune-placeholder");
    const mysteryCard = $(".mystery-card", placeholder);
    const result = $("#fortune-result");
    result.hidden = true;
    placeholder.hidden = false;
    mysteryCard.classList.remove("is-drawing");
    void mysteryCard.offsetWidth;
    mysteryCard.classList.add("is-drawing");

    setTimeout(() => {
      currentFortune = randomItem(window.FORTUNE_DATA);
      $("#fortune-grade").textContent = currentFortune.grade;
      $("#fortune-date").textContent = formatKoreanDate(todayKey());
      $("#fortune-kicker").textContent = currentFortune.kicker;
      $("#fortune-result-title").textContent = currentFortune.title;
      $("#fortune-result-message").textContent = currentFortune.message;
      $("#fortune-luck").textContent = `${currentFortune.luck}%`;
      $("#fortune-color").textContent = currentFortune.color;
      $("#fortune-item").textContent = currentFortune.item;
      $("#fortune-advice").textContent = currentFortune.advice;
      placeholder.hidden = true;
      result.hidden = false;
      $("#save-fortune-button").hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 760);
  }

  function saveFortune() {
    if (!currentFortune) return;
    if (!currentUser()) {
      showToast("로그인하면 결과를 달력에 저장할 수 있어요.");
      routeTo("more");
      return;
    }
    const record = dateRecord(todayKey(), true);
    record.entries.push({
      entryId: uid("entry"),
      type: "fortune",
      title: currentFortune.title,
      summary: `${currentFortune.grade} · 행운 ${currentFortune.luck}%`,
      message: currentFortune.message,
      payload: currentFortune,
      savedAt: new Date().toISOString()
    });
    persistState();
    renderTodayRecords();
    renderAccount();
    showToast("오늘의 운세를 달력에 저장했어요.");
  }

  function calculateNameSeed(...values) {
    const text = values.join("|");
    let seed = 0;
    for (let index = 0; index < text.length; index += 1) seed = (seed * 31 + text.charCodeAt(index)) >>> 0;
    return seed;
  }

  function drawCompatibility(event) {
    event.preventDefault();
    const personA = $("#person-a").value.trim();
    const personB = $("#person-b").value.trim();
    const relationshipType = $("#relationship-type").value;
    if (!personA || !personB) {
      showToast("두 사람의 이름을 모두 입력해 주세요.");
      return;
    }

    const base = randomItem(window.COMPATIBILITY_DATA);
    const nameSeed = calculateNameSeed(personA, personB, relationshipType, todayKey());
    const adjustment = (nameSeed % 13) - 6;
    const score = Math.max(45, Math.min(99, base.baseScore + adjustment));
    currentCompatibility = { ...base, score, personA, personB, relationshipType };

    $("#result-person-a").textContent = personA;
    $("#result-person-b").textContent = personB;
    $("#compatibility-score").textContent = score;
    $("#compatibility-kicker").textContent = `${relationshipType} · ${base.kicker}`;
    $("#compatibility-result-title").textContent = base.title;
    $("#compatibility-result-message").textContent = base.message;
    $("#compatibility-strength").textContent = base.strength;
    $("#compatibility-caution").textContent = base.caution;
    $("#compatibility-action").textContent = base.action;
    $("#compatibility-place").textContent = base.place;
    const result = $("#compatibility-result");
    result.hidden = false;
    requestAnimationFrame(() => { $("#chemistry-fill").style.width = `${score}%`; });
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveCompatibility() {
    if (!currentCompatibility) return;
    if (!currentUser()) {
      showToast("로그인하면 결과를 달력에 저장할 수 있어요.");
      routeTo("more");
      return;
    }
    const record = dateRecord(todayKey(), true);
    record.entries.push({
      entryId: uid("entry"),
      type: "compatibility",
      title: `${currentCompatibility.personA} ♡ ${currentCompatibility.personB}`,
      summary: `${currentCompatibility.relationshipType} 궁합 ${currentCompatibility.score}점`,
      message: currentCompatibility.message,
      payload: currentCompatibility,
      savedAt: new Date().toISOString()
    });
    persistState();
    renderTodayRecords();
    renderAccount();
    showToast("오늘의 궁합을 달력에 저장했어요.");
  }

  function renderCalendar() {
    const user = currentUser();
    $("#calendar-auth-wall").hidden = Boolean(user);
    $("#calendar-content").hidden = !user;
    if (!user) return;

    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    $("#calendar-month-label").textContent = `${year}년 ${month + 1}월`;
    const grid = $("#calendar-grid");
    grid.innerHTML = "";

    const firstDate = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - firstDate.getDay());
    const records = userRecords() || {};

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const key = formatDateKey(date);
      const record = records[key];
      const hasData = record && ((record.entries && record.entries.length) || (record.memo && record.memo.trim()));
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = date.getDate();
      button.dataset.date = key;
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `${formatKoreanDate(key)}${hasData ? ", 기록 있음" : ""}`);
      if (date.getMonth() !== month) button.classList.add("is-outside");
      if (key === todayKey()) button.classList.add("is-today");
      if (key === selectedDateKey) button.classList.add("is-selected");
      if (hasData) button.classList.add("has-data");
      grid.appendChild(button);
    }
  }

  function openRecordModal(dateKey) {
    selectedDateKey = dateKey;
    renderCalendar();
    const record = dateRecord(dateKey);
    $("#record-modal-title").textContent = formatKoreanDate(dateKey);
    $("#daily-memo").value = record ? record.memo : "";
    renderModalRecords(record ? record.entries : []);
    $("#record-modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeRecordModal() {
    $("#record-modal").hidden = true;
    document.body.style.overflow = "";
  }

  function renderModalRecords(entries) {
    const list = $("#modal-record-list");
    if (!entries || entries.length === 0) {
      list.innerHTML = '<div class="record-empty">이 날짜에 저장된 운세나 궁합이 없어요.</div>';
      return;
    }
    list.innerHTML = entries.map((entry) => {
      const label = entry.type === "fortune" ? "✦ 운세" : "♡ 궁합";
      return `<article class="record-item"><small>${label} · ${formatSavedTime(entry.savedAt)}</small><strong>${escapeHtml(entry.title)}</strong><p>${escapeHtml(entry.summary || entry.message || "")}</p><button class="record-delete" type="button" data-delete-entry="${escapeHtml(entry.entryId)}" aria-label="이 기록 삭제">×</button></article>`;
    }).join("");
  }

  function formatSavedTime(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "저장됨";
    return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit" }).format(date);
  }

  function saveMemo() {
    if (!currentUser()) return;
    const record = dateRecord(selectedDateKey, true);
    record.memo = $("#daily-memo").value.trim();
    if (record.entries.length === 0 && !record.memo) {
      delete userRecords()[selectedDateKey];
    }
    persistState();
    renderCalendar();
    renderAccount();
    showToast("메모를 저장했어요.");
  }

  function deleteEntry(entryId) {
    const record = dateRecord(selectedDateKey);
    if (!record) return;
    record.entries = record.entries.filter((entry) => entry.entryId !== entryId);
    if (record.entries.length === 0 && !record.memo) delete userRecords()[selectedDateKey];
    persistState();
    renderModalRecords(record.entries);
    renderCalendar();
    renderTodayRecords();
    renderAccount();
    showToast("기록을 삭제했어요.");
  }

  async function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nickname = String(formData.get("nickname") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    if (nickname.length < 1 || password.length < 4) {
      showToast("닉네임과 4자 이상의 비밀번호를 입력해 주세요.");
      return;
    }
    if (state.users.some((user) => user.email === email)) {
      showToast("이미 가입된 이메일이에요.");
      return;
    }
    const user = {
      id: uid("user"), nickname, email,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString()
    };
    state.users.push(user);
    state.sessionUserId = user.id;
    state.records[user.id] = {};
    persistState();
    event.currentTarget.reset();
    updateAuthUI();
    showToast(`${nickname}님, 환영해요!`);
  }

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const passwordHash = await hashPassword(String(formData.get("password") || ""));
    const user = state.users.find((item) => item.email === email && item.passwordHash === passwordHash);
    if (!user) {
      showToast("이메일 또는 비밀번호를 확인해 주세요.");
      return;
    }
    state.sessionUserId = user.id;
    persistState();
    event.currentTarget.reset();
    updateAuthUI();
    showToast(`${user.nickname}님, 다시 만나서 반가워요.`);
  }

  function logout() {
    state.sessionUserId = null;
    persistState();
    updateAuthUI();
    showToast("로그아웃했어요.");
  }

  function deleteCurrentAccount() {
    const user = currentUser();
    if (!user) return;
    state.users = state.users.filter((item) => item.id !== user.id);
    delete state.records[user.id];
    state.sessionUserId = null;
    persistState();
    closeConfirmModal();
    updateAuthUI();
    showToast("이 브라우저에서 계정과 기록을 삭제했어요.");
  }

  function updateAuthUI() {
    const user = currentUser();
    $("#header-account-button").innerHTML = user
      ? `<span class="header-avatar" aria-hidden="true">${escapeHtml(user.nickname.charAt(0) || "달")}</span>`
      : '<span aria-hidden="true">♙</span>';
    renderAccount();
    renderCalendar();
    renderTodayRecords();
  }

  function switchAuthTab(tabName) {
    $$("[data-auth-tab]").forEach((button) => button.classList.toggle("is-active", button.dataset.authTab === tabName));
    $$("[data-auth-panel]").forEach((panel) => { panel.hidden = panel.dataset.authPanel !== tabName; });
  }

  function exportData() {
    const user = currentUser();
    if (!user) return;
    const payload = {
      app: "달빛 운세함",
      version: 1,
      exportedAt: new Date().toISOString(),
      user: { nickname: user.nickname, email: user.email, createdAt: user.createdAt },
      records: userRecords() || {}
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `운세함-백업-${todayKey()}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("백업 파일을 만들었어요.");
  }

  async function importData(file) {
    const user = currentUser();
    if (!user || !file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed.records || typeof parsed.records !== "object") throw new Error("invalid format");
      state.records[user.id] = parsed.records;
      persistState();
      updateAuthUI();
      showToast("백업 기록을 불러왔어요.");
    } catch (error) {
      console.warn(error);
      showToast("올바른 운세함 백업 파일이 아니에요.");
    } finally {
      $("#import-data-input").value = "";
    }
  }

  function openConfirmModal(title, message, action) {
    $("#confirm-title").textContent = title;
    $("#confirm-message").textContent = message;
    confirmAction = action;
    $("#confirm-modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeConfirmModal() {
    $("#confirm-modal").hidden = true;
    document.body.style.overflow = "";
    confirmAction = null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function registerEvents() {
    document.addEventListener("click", (event) => {
      const routeButton = event.target.closest("[data-route]");
      if (routeButton) {
        routeTo(routeButton.dataset.route);
        return;
      }
      const authTab = event.target.closest("[data-auth-tab]");
      if (authTab) switchAuthTab(authTab.dataset.authTab);
    });

    $("#draw-fortune-button").addEventListener("click", drawFortune);
    $("#save-fortune-button").addEventListener("click", saveFortune);
    $("#compatibility-form").addEventListener("submit", drawCompatibility);
    $("#save-compatibility-button").addEventListener("click", saveCompatibility);

    $("#prev-month").addEventListener("click", () => {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
      renderCalendar();
    });
    $("#next-month").addEventListener("click", () => {
      calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
      renderCalendar();
    });
    $("#calendar-grid").addEventListener("click", (event) => {
      const day = event.target.closest(".calendar-day");
      if (day) openRecordModal(day.dataset.date);
    });

    $("#close-record-modal").addEventListener("click", closeRecordModal);
    $("#record-modal").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) closeRecordModal();
      const deleteButton = event.target.closest("[data-delete-entry]");
      if (deleteButton) {
        const entryId = deleteButton.dataset.deleteEntry;
        openConfirmModal("이 기록을 삭제할까요?", "삭제한 운세나 궁합 기록은 되돌릴 수 없어요.", () => {
          deleteEntry(entryId);
          closeConfirmModal();
        });
      }
    });
    $("#save-daily-memo").addEventListener("click", saveMemo);

    $("#login-form").addEventListener("submit", handleLogin);
    $("#signup-form").addEventListener("submit", handleSignup);
    $("#logout-button").addEventListener("click", logout);
    $("#delete-account-button").addEventListener("click", () => {
      openConfirmModal("계정과 기록을 모두 삭제할까요?", "현재 브라우저에 저장된 계정, 운세, 궁합, 메모가 전부 삭제됩니다.", deleteCurrentAccount);
    });
    $("#export-data-button").addEventListener("click", exportData);
    $("#import-data-input").addEventListener("change", (event) => importData(event.target.files[0]));

    $("#confirm-cancel").addEventListener("click", closeConfirmModal);
    $("#confirm-ok").addEventListener("click", () => { if (typeof confirmAction === "function") confirmAction(); });
    $("#confirm-modal").addEventListener("click", (event) => { if (event.target === event.currentTarget) closeConfirmModal(); });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!$("#confirm-modal").hidden) closeConfirmModal();
        else if (!$("#record-modal").hidden) closeRecordModal();
      }
    });

    window.addEventListener("hashchange", () => routeTo(location.hash.replace("#", "") || "home", false));
  }

  function init() {
    if (!Array.isArray(window.FORTUNE_DATA) || window.FORTUNE_DATA.length !== 200) {
      console.error("운세 데이터가 정상적으로 로드되지 않았습니다.");
    }
    if (!Array.isArray(window.COMPATIBILITY_DATA) || window.COMPATIBILITY_DATA.length !== 200) {
      console.error("궁합 데이터가 정상적으로 로드되지 않았습니다.");
    }
    registerEvents();
    updateAuthUI();
    const initialRoute = location.hash.replace("#", "") || "home";
    routeTo(initialRoute, false);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
