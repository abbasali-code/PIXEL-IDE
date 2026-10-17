    /* ===================== Highlighting ===================== */
    const C_LIKE = new Set(["javascript", "java", "cpp", "css"]);
    const KEYWORDS = {
      javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "class", "new", "import", "export", "from", "async", "await", "try", "catch", "finally", "throw", "typeof", "instanceof", "of", "in", "true", "false", "null", "undefined", "this", "super", "extends", "static", "default", "void", "yield", "delete"],
      java: ["public", "private", "protected", "class", "interface", "static", "void", "int", "long", "double", "float", "boolean", "char", "byte", "short", "new", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "throws", "import", "package", "extends", "implements", "this", "super", "null", "true", "false"],
      cpp: ["int", "long", "double", "float", "bool", "char", "void", "auto", "const", "class", "struct", "public", "private", "protected", "static", "virtual", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new", "delete", "try", "catch", "throw", "namespace", "using", "include", "true", "false", "nullptr", "this"],
      css: ["important"],
      python: ["def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "class", "import", "from", "as", "try", "except", "finally", "raise", "with", "lambda", "yield", "pass", "break", "continue", "True", "False", "None", "self", "async", "await", "global", "nonlocal"]
    };
    const FILE = {
      javascript: ["app", ".js"],
      html: ["index", ".html"],
      css: ["style", ".css"],
      python: ["main", ".py"],
      java: ["Main", ".java"],
      cpp: ["main", ".cpp"],
      text: ["notes", ".txt"]
    };

    function escapeHtml(text) {
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function span(kind, text) {
      return '<span class="tok tok-' + kind + '">' + escapeHtml(text) + "</span>";
    }
    function highlightTag(chunk) {
      let html = "", i = 0;
      if (chunk[i] === "<") { html += escapeHtml("<"); i += 1; }
      if (chunk[i] === "/") { html += escapeHtml("/"); i += 1; }
      const name = chunk.slice(i).match(/^[A-Za-z][\w:-]*/);
      if (name) { html += span("tag", name[0]); i += name[0].length; }
      while (i < chunk.length) {
        const rest = chunk.slice(i);
        if (rest[0] === ">" || rest.startsWith("/>")) {
          html += escapeHtml(rest[0] === ">" ? ">" : "/>");
          break;
        }
        const str = rest.match(/^(?:"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/);
        if (str) { html += span("string", str[0]); i += str[0].length; continue; }
        const attr = rest.match(/^[A-Za-z_:][\w:.-]*/);
        if (attr && (i === 0 || /\s/.test(chunk[i - 1]) || chunk[i - 1] === "<")) {
          html += span("attr", attr[0]); i += attr[0].length; continue;
        }
        html += escapeHtml(chunk[i]); i += 1;
      }
      return html;
    }
    function highlightHtmlLine(line, inComment) {
      let i = 0, html = "", comment = inComment;
      if (comment) {
        const end = line.indexOf("-->");
        if (end === -1) return { html: span("comment", line), inComment: true };
        html += span("comment", line.slice(0, end + 3));
        i = end + 3; comment = false;
      }
      while (i < line.length) {
        if (line.startsWith("<!--", i)) {
          const end = line.indexOf("-->", i + 4);
          if (end === -1) return { html: html + span("comment", line.slice(i)), inComment: true };
          html += span("comment", line.slice(i, end + 3)); i = end + 3; continue;
        }
        if (line[i] === "<") {
          const close = line.indexOf(">", i + 1);
          html += highlightTag(close === -1 ? line.slice(i) : line.slice(i, close + 1));
          if (close === -1) break;
          i = close + 1; continue;
        }
        const next = line.indexOf("<", i);
        html += escapeHtml(next === -1 ? line.slice(i) : line.slice(i, next));
        if (next === -1) break;
        i = next;
      }
      return { html, inComment: comment };
    }
    function highlightCodeLine(line, lang, inBlock) {
      const words = new Set(KEYWORDS[lang] || []);
      const cLike = C_LIKE.has(lang);
      let i = 0, html = "", block = inBlock;
      if (block) {
        const end = line.indexOf("*/");
        if (end === -1) return { html: span("comment", line), inBlock: true };
        html += span("comment", line.slice(0, end + 2));
        i = end + 2; block = false;
      }
      while (i < line.length) {
        const rest = line.slice(i);
        if (cLike && rest.startsWith("//")) { html += span("comment", rest); break; }
        if (lang === "python" && rest.startsWith("#")) { html += span("comment", rest); break; }
        if (cLike && rest.startsWith("/*")) {
          const end = rest.indexOf("*/", 2);
          if (end === -1) return { html: html + span("comment", rest), inBlock: true };
          html += span("comment", rest.slice(0, end + 2)); i += end + 2; continue;
        }
        const str = rest.match(/^(?:`(?:\\[\s\S]|[^`\\])*`|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*')/);
        if (str) { html += span("string", str[0]); i += str[0].length; continue; }
        if (lang === "css" && /^#[0-9a-fA-F]{3,8}\b/.test(rest)) {
          const hex = rest.match(/^#[0-9a-fA-F]{3,8}/);
          html += span("number", hex[0]); i += hex[0].length; continue;
        }
        if ((i === 0 || !/[\w$]/.test(line[i - 1])) && /^\d+(?:\.\d+)?/.test(rest)) {
          const num = rest.match(/^\d+(?:\.\d+)?/);
          html += span("number", num[0]); i += num[0].length; continue;
        }
        const id = rest.match(/^[A-Za-z_$][\w$]*/);
        if (id) {
          html += words.has(id[0]) ? span("keyword", id[0]) : escapeHtml(id[0]);
          i += id[0].length; continue;
        }
        html += escapeHtml(rest[0]); i += 1;
      }
      return { html, inBlock: block };
    }
    function highlightLines(source, lang) {
      const lines = source.split("\n");
      if (lang === "text") return lines.map(escapeHtml);
      let inBlock = false;
      return lines.map(function (line) {
        if (lang === "html") {
          const result = highlightHtmlLine(line, inBlock);
          inBlock = result.inComment;
          return result.html;
        }
        const result = highlightCodeLine(line, lang, inBlock);
        inBlock = result.inBlock;
        return result.html;
      });
    }

    /* ===================== DOM refs ===================== */
    const editor = document.getElementById("editor");
    const gutter = document.getElementById("gutter");
    const hl = document.getElementById("hl");
    const scroll = document.getElementById("scroll");
    const language = document.getElementById("language");
    const tabBar = document.getElementById("tabs");
    const codeCol = document.getElementById("code-col");
    const acBox = document.getElementById("autocomplete");
    const statusInfo = document.getElementById("status-info");

    /* ===================== Tabs state ===================== */
    let nextId = 2;
    let tabs = [{ id: 1, name: "app.js", lang: "javascript", value: "" }];
    let activeId = 1;

    function current() {
      return tabs.find(function (tab) { return tab.id === activeId; });
    }
    function nameFor(lang, exceptId) {
      const pair = FILE[lang];
      const used = new Set(tabs.filter(function (tab) { return tab.id !== exceptId; }).map(function (tab) { return tab.name; }));
      const first = pair[0] + pair[1];
      if (!used.has(first)) return first;
      let n = 2;
      while (used.has(pair[0] + n + pair[1])) n += 1;
      return pair[0] + n + pair[1];
    }
    function saveActive() {
      const tab = current();
      if (tab) tab.value = editor.value;
    }
    function loadActive() {
      const tab = current();
      editor.value = tab.value;
      language.value = tab.lang;
      renderTabs();
      render();
    }
    function renderTabs() {
      tabBar.replaceChildren();
      tabs.forEach(function (tab) {
        const row = document.createElement("div");
        row.className = "tab" + (tab.id === activeId ? " active" : "");
        const name = document.createElement("button");
        name.type = "button";
        name.className = "tab-name";
        name.textContent = tab.name;
        name.addEventListener("click", function () { openTab(tab.id); });
        const close = document.createElement("button");
        close.type = "button";
        close.className = "tab-close";
        close.textContent = "\u00d7";
        close.setAttribute("aria-label", "Close " + tab.name);
        close.addEventListener("click", function (event) {
          event.stopPropagation();
          closeTab(tab.id);
        });
        row.append(name, close);
        tabBar.appendChild(row);
      });
    }
    function openTab(id) {
      if (id === activeId) return;
      saveActive();
      activeId = id;
      loadActive();
    }
    function closeTab(id) {
      saveActive();
      if (tabs.length === 1) {
        tabs[0].name = "app.js";
        tabs[0].lang = "javascript";
        tabs[0].value = "";
        activeId = tabs[0].id;
        loadActive();
        return;
      }
      const index = tabs.findIndex(function (tab) { return tab.id === id; });
      tabs.splice(index, 1);
      if (activeId === id) activeId = tabs[Math.max(0, index - 1)].id;
      loadActive();
    }
    function addTab() {
      saveActive();
      const tab = { id: nextId++, name: "", lang: "javascript", value: "" };
      tab.name = nameFor("javascript", tab.id);
      tabs.push(tab);
      activeId = tab.id;
      loadActive();
    }

    /* ===================== Render ===================== */
    function render() {
      const lines = editor.value.split("\n");
      const highlighted = highlightLines(editor.value, language.value);
      gutter.style.minWidth = (String(lines.length).length + 2) + "ch";
      gutter.replaceChildren();
      hl.replaceChildren();
      for (let i = 0; i < lines.length; i++) {
        const ln = document.createElement("div");
        ln.className = "ln";
        ln.textContent = String(i + 1);
        gutter.appendChild(ln);
        const code = document.createElement("div");
        code.className = "code-line";
        code.innerHTML = highlighted[i].length ? highlighted[i] : "\u200b";
        hl.appendChild(code);
      }
      updateStatus();
    }
    function updateStatus() {
      const before = editor.value.slice(0, editor.selectionStart);
      const line = before.split("\n").length;
      const col = before.length - (before.lastIndexOf("\n") + 1) + 1;
      statusInfo.textContent = "Ln " + line + ", Col " + col;
    }
    function revealCaret() {
      editor.scrollTop = 0;
      editor.scrollLeft = 0;
      const style = getComputedStyle(editor);
      const lineHeight = parseFloat(style.lineHeight) || 24;
      const padTop = parseFloat(style.paddingTop) || 0;
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const fontSize = parseFloat(style.fontSize) || 14;
      const before = editor.value.slice(0, editor.selectionStart);
      const line = before.split("\n").length - 1;
      const col = before.length - (before.lastIndexOf("\n") + 1);
      const top = padTop + line * lineHeight;
      const bottom = top + lineHeight;
      if (top < scroll.scrollTop) scroll.scrollTop = top;
      else if (bottom > scroll.scrollTop + scroll.clientHeight) scroll.scrollTop = bottom - scroll.clientHeight + 8;
      const x = padLeft + col * fontSize * 0.62;
      if (x < scroll.scrollLeft + padLeft) scroll.scrollLeft = Math.max(0, x - padLeft);
      else if (x > scroll.scrollLeft + scroll.clientWidth - 48) scroll.scrollLeft = x - scroll.clientWidth + 64;
    }

    /* ===================== Custom Dictionary ===================== */
    const CUSTOM_KEY = "pixel-ide-custom-dict-v1";
    let customDict = {};

    function loadCustomDict() {
      try {
        const raw = localStorage.getItem(CUSTOM_KEY);
        if (raw) customDict = JSON.parse(raw) || {};
      } catch (e) { customDict = {}; }
    }
    function saveCustomDict() {
      try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(customDict)); } catch (e) { }
    }
    function getCustomEntries(lang) {
      return customDict[lang] || [];
    }
    function addCustomEntry(lang, entry) {
      if (!customDict[lang]) customDict[lang] = [];
      const exists = customDict[lang].some(function (e) { return e.label === entry.label; });
      if (exists) return false;
      customDict[lang].push(entry);
      saveCustomDict();
      return true;
    }
    function removeCustomEntry(lang, label) {
      if (!customDict[lang]) return;
      customDict[lang] = customDict[lang].filter(function (e) { return e.label !== label; });
      if (!customDict[lang].length) delete customDict[lang];
      saveCustomDict();
    }

    /* ===================== Autocomplete ===================== */
    let acItems = [];
    let acIndex = 0;
    let acWordStart = 0;

    const IDENT_RE = /[A-Za-z_$][\w$]*/g;

    function collectUserWords() {
      const found = new Map();
      const text = editor.value;
      let m;
      IDENT_RE.lastIndex = 0;
      while ((m = IDENT_RE.exec(text))) {
        const w = m[0];
        if (w.length < 2) continue;
        found.set(w, (found.get(w) || 0) + 1);
      }
      return found;
    }

    function getWordRange() {
      const pos = editor.selectionStart;
      const value = editor.value;
      let start = pos;
      while (start > 0 && /[\w$]/.test(value[start - 1])) start--;
      return { start, end: pos, word: value.slice(start, pos) };
    }

    function getSuggestions() {
      const lang = language.value;
      const { start, end, word } = getWordRange();
      if (!word) return { items: [], start, end, word };
      const lower = word.toLowerCase();
      const items = [];
      const seen = new Set();

      // 1) دیکشنری شخصی — بالاترین اولویت
      getCustomEntries(lang).forEach(function (entry) {
        if (entry.label === word) return;
        if (!entry.label.toLowerCase().startsWith(lower)) return;
        if (seen.has(entry.label)) return;
        seen.add(entry.label);
        items.push({
          label: entry.label,
          kind: entry.kind || "word",
          count: 0,
          insert: entry.insert,
          source: "custom"
        });
      });

      if (lang !== "text") {
        // 2) کلمات کلیدی
        const keywords = new Set(KEYWORDS[lang] || []);
        keywords.forEach(function (kw) {
          if (kw !== word && kw.toLowerCase().startsWith(lower) && !seen.has(kw)) {
            seen.add(kw);
            items.push({ label: kw, kind: "keyword", count: 0, source: "keyword" });
          }
        });

        // 3) کلمات تایپ‌شده توسط کاربر
        const userWords = collectUserWords();
        userWords.forEach(function (count, w) {
          if (seen.has(w) || w === word) return;
          if (w.toLowerCase().startsWith(lower)) {
            seen.add(w);
            items.push({ label: w, kind: "word", count: count, source: "user" });
          }
        });
      } else {
        // حالت Plain text: فقط کلمات کاربر
        const userWords = collectUserWords();
        userWords.forEach(function (count, w) {
          if (seen.has(w) || w === word) return;
          if (w.toLowerCase().startsWith(lower)) {
            seen.add(w);
            items.push({ label: w, kind: "word", count: count, source: "user" });
          }
        });
      }

      // اولویت: custom > keyword > word
      const rank = function (it) {
        if (it.source === "custom") return 0;
        if (it.source === "keyword") return 1;
        return 2;
      };
      items.sort(function (a, b) {
        const ra = rank(a), rb = rank(b);
        if (ra !== rb) return ra - rb;
        if (a.source === "user" && b.source === "user") return b.count - a.count;
        return 0;
      });

      return { items: items.slice(0, 15), start, end, word };
    }

    function positionPopup() {
      const style = getComputedStyle(editor);
      const lineHeight = parseFloat(style.lineHeight) || 24;
      const padTop = parseFloat(style.paddingTop) || 0;
      const padLeft = parseFloat(style.paddingLeft) || 0;
      const fontSize = parseFloat(style.fontSize) || 14;

      const before = editor.value.slice(0, editor.selectionStart);
      const line = before.split("\n").length - 1;
      const col = before.length - (before.lastIndexOf("\n") + 1);

      const y = padTop + (line + 1) * lineHeight - scroll.scrollTop + 4;
      const x = padLeft + col * fontSize * 0.62 - scroll.scrollLeft;

      acBox.style.left = Math.max(4, x) + "px";
      acBox.style.top = Math.max(4, y) + "px";

      const boxH = acBox.offsetHeight;
      if (y + boxH > scroll.clientHeight - 8) {
        acBox.style.top = Math.max(4, y - lineHeight - boxH - 8) + "px";
      }
    }

    function renderAutocomplete(word) {
      if (!acItems.length) {
        acBox.classList.remove("open");
        return;
      }
      const lower = word.toLowerCase();
      acBox.replaceChildren();
      acItems.forEach(function (item, idx) {
        const row = document.createElement("div");
        row.className = "ac-item" + (idx === acIndex ? " active" : "");
        row.setAttribute("role", "option");
        const label = document.createElement("span");
        const matchLen = lower.length;
        if (item.label.toLowerCase().startsWith(lower)) {
          const match = document.createElement("span");
          match.className = "ac-match";
          match.textContent = item.label.slice(0, matchLen);
          label.append(match, document.createTextNode(item.label.slice(matchLen)));
        } else {
          label.textContent = item.label;
        }
        const kind = document.createElement("span");
        kind.className = "ac-kind";
        kind.textContent = item.kind || "word";
        row.append(label, kind);
        row.addEventListener("mousedown", function (e) {
          e.preventDefault();
          acIndex = idx;
          acceptSuggestion();
        });
        acBox.appendChild(row);
      });
      acBox.classList.add("open");
      positionPopup();
      const activeEl = acBox.querySelector(".ac-item.active");
      if (activeEl) activeEl.scrollIntoView({ block: "nearest" });
    }

    function hideAutocomplete() {
      acItems = [];
      acBox.classList.remove("open");
    }

    function acceptSuggestion() {
      if (!acItems.length) return;
      const item = acItems[acIndex];
      const start = acWordStart;
      const end = editor.selectionEnd;
      const insertText = item.insert || item.label;
      editor.value = editor.value.slice(0, start) + insertText + editor.value.slice(end);
      const caret = start + insertText.length;
      editor.selectionStart = editor.selectionEnd = caret;
      hideAutocomplete();
      saveActive();
      render();
      revealCaret();
      editor.focus();
    }

    function triggerAutocomplete() {
      const result = getSuggestions();
      acItems = result.items;
      acWordStart = result.start;
      acIndex = 0;
      if (acItems.length) {
        renderAutocomplete(result.word);
      } else {
        acBox.classList.remove("open");
      }
    }

    /* ===================== Dictionary modal ===================== */
    const toastEl = document.getElementById("dict-toast");
    let toastTimer = null;
    function showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1600);
    }

    const dictOverlay = document.getElementById("dict-overlay");
    const dictLang = document.getElementById("dict-lang");
    const dictLabel = document.getElementById("dict-label");
    const dictKind = document.getElementById("dict-kind");
    const dictInsert = document.getElementById("dict-insert");
    const dictInsertWrap = document.getElementById("dict-insert-wrap");
    const dictItems = document.getElementById("dict-items");
    const openDictBtn = document.getElementById("open-dict");
    const dictCloseBtn = document.getElementById("dict-close");
    const dictCancelBtn = document.getElementById("dict-cancel");
    const dictAddBtn = document.getElementById("dict-add");

    function renderDictItems() {
      const lang = dictLang.value;
      const list = getCustomEntries(lang);
      dictItems.replaceChildren();
      if (!list.length) {
        const empty = document.createElement("div");
        empty.className = "dict-empty";
        empty.textContent = "No custom entries yet for this language.";
        dictItems.appendChild(empty);
        return;
      }
      list.forEach(function (entry) {
        const row = document.createElement("div");
        row.className = "dict-row";
        const label = document.createElement("span");
        label.className = "dict-row-label";
        label.textContent = entry.label;
        label.title = entry.insert || entry.label;
        const kind = document.createElement("span");
        kind.className = "dict-row-kind";
        kind.textContent = entry.kind;
        const del = document.createElement("button");
        del.type = "button";
        del.className = "dict-row-del";
        del.textContent = "\u00d7";
        del.setAttribute("aria-label", "Remove " + entry.label);
        del.addEventListener("click", function () {
          removeCustomEntry(lang, entry.label);
          renderDictItems();
          showToast("Removed: " + entry.label);
        });
        row.append(label, kind, del);
        dictItems.appendChild(row);
      });
    }

    function openDict() {
      dictLang.value = language.value;
      dictLabel.value = "";
      dictKind.value = "keyword";
      dictInsert.value = "";
      dictInsertWrap.style.display = "none";
      renderDictItems();
      dictOverlay.classList.add("open");
      setTimeout(function () { dictLabel.focus(); }, 50);
    }
    function closeDict() {
      dictOverlay.classList.remove("open");
    }

    openDictBtn.addEventListener("click", openDict);
    dictCloseBtn.addEventListener("click", closeDict);
    dictCancelBtn.addEventListener("click", closeDict);
    dictOverlay.addEventListener("click", function (e) {
      if (e.target === dictOverlay) closeDict();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dictOverlay.classList.contains("open")) closeDict();
    });

    dictLang.addEventListener("change", renderDictItems);
    dictKind.addEventListener("change", function () {
      dictInsertWrap.style.display = dictKind.value === "snippet" ? "" : "none";
    });
    dictLabel.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); dictAddBtn.click(); }
    });

    dictAddBtn.addEventListener("click", function () {
      const lang = dictLang.value;
      const label = dictLabel.value.trim();
      const kind = dictKind.value;
      const insert = dictInsert.value;
      if (!label) { dictLabel.focus(); return; }
      const entry = { label: label, kind: kind };
      if (kind === "snippet" && insert) entry.insert = insert;
      const ok = addCustomEntry(lang, entry);
      if (!ok) { showToast("Already exists: " + label); return; }
      dictLabel.value = "";
      dictInsert.value = "";
      renderDictItems();
      showToast("Added to " + lang + ": " + label);
      dictLabel.focus();
    });

    /* ===================== Events ===================== */
    editor.addEventListener("input", function () {
      saveActive();
      render();
      revealCaret();
      triggerAutocomplete();
    });
    editor.addEventListener("keyup", function (e) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
        revealCaret();
        updateStatus();
      }
    });
    editor.addEventListener("click", function () {
      revealCaret();
      updateStatus();
      hideAutocomplete();
    });
    editor.addEventListener("scroll", function () {
      if (editor.scrollTop || editor.scrollLeft) {
        scroll.scrollTop += editor.scrollTop;
        scroll.scrollLeft += editor.scrollLeft;
        editor.scrollTop = 0;
        editor.scrollLeft = 0;
      }
    });
    editor.addEventListener("blur", function () {
      setTimeout(function () {
        if (document.activeElement !== editor) hideAutocomplete();
      }, 120);
    });

    editor.addEventListener("keydown", function (event) {
      const open = acBox.classList.contains("open") && acItems.length;

      if (open) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          acIndex = (acIndex + 1) % acItems.length;
          renderAutocomplete(getWordRange().word);
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          acIndex = (acIndex - 1 + acItems.length) % acItems.length;
          renderAutocomplete(getWordRange().word);
          return;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          event.preventDefault();
          acceptSuggestion();
          return;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          hideAutocomplete();
          return;
        }
      }

      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();
        triggerAutocomplete();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.slice(0, start) + "  " + editor.value.slice(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        saveActive();
        render();
        revealCaret();
        return;
      }

      if (event.key === "Enter") {
        hideAutocomplete();
      }
    });

    scroll.addEventListener("scroll", function () {
      if (acBox.classList.contains("open")) positionPopup();
    });

    language.addEventListener("change", function () {
      const tab = current();
      tab.lang = language.value;
      tab.name = nameFor(tab.lang, tab.id);
      renderTabs();
      render();
      hideAutocomplete();
    });

    document.getElementById("add-tab").addEventListener("click", addTab);

    /* ===================== Init ===================== */
    loadCustomDict();
    editor.value = "";
    renderTabs();
    render();
    revealCaret();