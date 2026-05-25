const FOLDER_ID = '1acJOXu2h3PCOecxUeiHVzQ6X_MxRD5IR';
const NOTE_FILE_NAME = '記事本.txt';

function doGet() {
  const note = getOrCreateNote_();
  const html = buildHtml_(note);
  return HtmlService.createHtmlOutput(html)
    .setTitle('雲端記事本')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getInitialData() {
  const note = getOrCreateNote_();
  return {
    fileName: note.file.getName(),
    content: note.content,
    lastUpdatedText: formatDateTime_(note.file.getLastUpdated()),
    fileExists: true,
  };
}

function saveNote(content) {
  const note = getOrCreateNote_();
  const text = typeof content === 'string' ? content : '';
  note.file.setContent(text);

  return {
    ok: true,
    fileName: note.file.getName(),
    lastUpdatedText: formatDateTime_(note.file.getLastUpdated()),
    content: text,
  };
}

function getOrCreateNote_() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFilesByName(NOTE_FILE_NAME);

  if (files.hasNext()) {
    const file = files.next();
    return {
      file: file,
      content: file.getBlob().getDataAsString(),
    };
  }

  const file = folder.createFile(NOTE_FILE_NAME, '', MimeType.PLAIN_TEXT);
  return {
    file: file,
    content: '',
  };
}

function formatDateTime_(value) {
  if (!(value instanceof Date)) {
    return '未知';
  }

  return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy/M/d a h:mm:ss');
}

function buildHtml_(note) {
  const initialData = {
    fileName: note.file.getName(),
    content: note.content,
    lastUpdatedText: formatDateTime_(note.file.getLastUpdated()),
    statusText: '已保存',
  };

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>雲端記事本</title>
  <style>
    :root {
      --bg: #111111;
      --panel: #1b1b1b;
      --panel-2: #2a2a2a;
      --text: #f4f4f4;
      --muted: #a7a7a7;
      --border: #4f6fe0;
      --border-soft: rgba(79, 111, 224, 0.35);
      --accent-a: #6f7de8;
      --accent-b: #8a4dbf;
      --accent-c: #f2bc52;
      --shadow: rgba(0, 0, 0, 0.45);
      --success: #8bd26f;
      --danger: #ff7a7a;
      --button-text: #ffffff;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      min-height: 100%;
      background:
        radial-gradient(circle at top left, rgba(111, 125, 232, 0.22), transparent 28%),
        radial-gradient(circle at top right, rgba(138, 77, 191, 0.24), transparent 24%),
        linear-gradient(180deg, #1a1a1f 0%, #111111 100%);
      color: var(--text);
      font-family: 'Segoe UI', 'Microsoft JhengHei', sans-serif;
    }

    body {
      padding: 8px;
    }

    .app {
      min-height: calc(100vh - 16px);
      border-radius: 18px;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(28, 28, 31, 0.98), rgba(16, 16, 16, 0.98));
      border: 1px solid rgba(124, 124, 160, 0.26);
      box-shadow: 0 24px 60px var(--shadow);
      display: flex;
      flex-direction: column;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 24px 28px;
      background: linear-gradient(90deg, var(--accent-a), var(--accent-b));
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: #ffffff;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.18));
    }

    .save-state {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 999px;
      background: rgba(63, 36, 96, 0.6);
      color: #f8ecff;
      font-size: 18px;
      font-weight: 700;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      white-space: nowrap;
    }

    .save-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent-c);
      box-shadow: 0 0 0 4px rgba(242, 188, 82, 0.18);
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #151515;
    }

    .file-bar {
      padding: 26px 24px 12px;
      color: #bdbdbd;
      font-size: 20px;
      font-weight: 700;
    }

    .editor-wrap {
      flex: 1;
      padding: 0 20px 18px;
      display: flex;
    }

    .editor-shell {
      position: relative;
      flex: 1;
      border-radius: 16px;
      border: 2px solid rgba(79, 111, 224, 0.8);
      box-shadow: 0 0 0 3px rgba(79, 111, 224, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
      background: linear-gradient(180deg, #444444 0%, #373737 100%);
      overflow: hidden;
    }

    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: 0;
      outline: none;
      background: transparent;
      color: #ffffff;
      padding: 24px 26px;
      font-size: 22px;
      line-height: 1.7;
      font-family: inherit;
    }

    textarea::placeholder {
      color: rgba(255, 255, 255, 0.34);
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 18px 24px 22px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(26, 26, 28, 0.95);
    }

    .meta {
      color: #b0b0b0;
      font-size: 18px;
      line-height: 1.6;
    }

    .status-inline {
      margin-left: 10px;
      color: var(--muted);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .save-button {
      appearance: none;
      border: 0;
      border-radius: 10px;
      padding: 16px 28px;
      min-width: 150px;
      background: linear-gradient(90deg, var(--accent-a), var(--accent-b));
      color: var(--button-text);
      font-size: 20px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(96, 100, 214, 0.28);
      transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
    }

    .save-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(96, 100, 214, 0.32);
      filter: brightness(1.04);
    }

    .save-button:active {
      transform: translateY(0);
    }

    .save-button:disabled {
      opacity: 0.65;
      cursor: wait;
    }

    .save-icon {
      font-size: 20px;
      line-height: 1;
    }

    .state-saving {
      color: #ffd166;
    }

    .state-saved {
      color: var(--success);
    }

    .state-error {
      color: var(--danger);
    }

    @media (max-width: 900px) {
      .header,
      .footer {
        flex-direction: column;
        align-items: flex-start;
      }

      .brand {
        font-size: 26px;
      }

      textarea {
        font-size: 20px;
      }

      .meta,
      .file-bar,
      .save-state {
        font-size: 16px;
      }

      .save-button {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="app">
    <header class="header">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M11 20c0-7.18 5.82-13 13-13 5.96 0 11.03 4 12.57 9.48A9.5 9.5 0 0 1 34.5 28H15.5A4.5 4.5 0 0 1 11 23.5V20z" fill="#ffffff" stroke="#111111" stroke-width="3" stroke-linejoin="round"/>
          <path d="M12 29.5h24.5a7.5 7.5 0 0 0 0-15" fill="none" stroke="#111111" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <span>雲端記事本</span>
      </div>
      <div class="save-state" id="saveState"><span class="save-dot"></span><span id="saveStateText">未保存</span></div>
    </header>

    <main class="content">
      <div class="file-bar" id="fileBar">📄 ${escapeHtml_(initialData.fileName)}</div>
      <div class="editor-wrap">
        <div class="editor-shell">
          <textarea id="editor" placeholder="開始輸入您的筆記...">${escapeHtml_(initialData.content)}</textarea>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="meta">
        <span id="lastUpdated">最後修改時間：${escapeHtml_(initialData.lastUpdatedText)}</span>
        <span class="status-inline" id="statusText">${escapeHtml_(initialData.statusText)}</span>
      </div>
      <div class="actions">
        <button class="save-button" id="saveButton" type="button">
          <span class="save-icon">💾</span>
          <span>Save</span>
        </button>
      </div>
    </footer>
  </div>

  <script>
    const state = {
      dirty: false,
      saving: false,
      lastSavedContent: ${JSON.stringify(initialData.content)},
    };

    const editor = document.getElementById('editor');
    const saveButton = document.getElementById('saveButton');
    const statusText = document.getElementById('statusText');
    const saveStateText = document.getElementById('saveStateText');
    const lastUpdated = document.getElementById('lastUpdated');

    function setStatus(message, kind) {
      statusText.textContent = message;
      saveStateText.textContent = message;
      statusText.className = 'status-inline ' + (kind ? 'state-' + kind : '');
      saveStateText.className = kind ? 'state-' + kind : '';
    }

    function setSaving(isSaving) {
      state.saving = isSaving;
      saveButton.disabled = isSaving;
      if (isSaving) {
        setStatus('儲存中…', 'saving');
      }
    }

    function markDirty() {
      const isDirty = editor.value !== state.lastSavedContent;
      state.dirty = isDirty;
      if (!state.saving) {
        setStatus(isDirty ? '未保存' : '已保存', isDirty ? '' : 'saved');
      }
    }

    function showError(message) {
      setStatus(message, 'error');
    }

    function saveNow() {
      if (state.saving) return;
      setSaving(true);
      google.script.run
        .withSuccessHandler(function (data) {
          state.lastSavedContent = data.content || '';
          state.dirty = false;
          lastUpdated.textContent = '最後修改時間：' + data.lastUpdatedText;
          setStatus('已保存', 'saved');
          setSaving(false);
        })
        .withFailureHandler(function (error) {
          setSaving(false);
          showError('儲存失敗：' + (error && error.message ? error.message : '未知錯誤'));
        })
        .saveNote(editor.value);
    }

    editor.addEventListener('input', markDirty);
    saveButton.addEventListener('click', saveNow);

    window.addEventListener('beforeunload', function (event) {
      if (state.dirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    });

    setStatus('已保存', 'saved');
  </script>
</body>
</html>`;
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
