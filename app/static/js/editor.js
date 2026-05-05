/* global CodeMirror */

const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  lineNumbers: true,
  mode: "null",
  theme: "material-darker",
  indentUnit: 2,
  tabSize: 2,
});

const term = document.getElementById("terminal-out");
const badge = document.getElementById("status-badge");
const execTime = document.getElementById("exec-time");
const shareBox = document.getElementById("share-box");
const shareUrl = document.getElementById("share-url");

function setStatus(ok, text) {
  badge.textContent = text;
  badge.classList.remove("ok", "err");
  badge.classList.add(ok ? "ok" : "err");
}

async function runCode() {
  term.textContent = "";
  setStatus(true, "Running…");
  execTime.textContent = "";
  const code = editor.getValue();
  try {
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    execTime.textContent = data.execution_time_ms != null ? `${data.execution_time_ms} ms` : "";
    if (data.ok) {
      setStatus(true, "Success");
      term.textContent = data.output || "";
    } else {
      setStatus(false, "Error");
      const parts = [];
      if (data.output) parts.push(data.output);
      if (data.error) parts.push(data.error);
      term.textContent = parts.join("\n") || "Unknown error";
    }
  } catch (e) {
    setStatus(false, "Network");
    term.textContent = String(e);
  }
}

document.getElementById("btn-run").addEventListener("click", runCode);

document.getElementById("btn-share").addEventListener("click", async () => {
  shareBox.classList.add("hidden");
  const code = editor.getValue();
  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!data.ok) {
      term.textContent = (term.textContent ? term.textContent + "\n\n" : "") + (data.error || "Share failed");
      setStatus(false, "Share failed");
      return;
    }
    const url = `${window.location.origin}${data.url}`;
    shareUrl.textContent = url;
    shareBox.classList.remove("hidden");
  } catch (e) {
    term.textContent = (term.textContent ? term.textContent + "\n\n" : "") + "Share Error: " + String(e);
    setStatus(false, "Share Error");
  }
});

document.getElementById("btn-copy-share").addEventListener("click", async () => {
  const t = shareUrl.textContent;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(t);
    }
  } catch (e) {
    console.error("Clipboard write failed", e);
  }
});

const rerun = sessionStorage.getItem("pahadi_rerun_code");
if (rerun) {
  editor.setValue(rerun);
  sessionStorage.removeItem("pahadi_rerun_code");
}

const params = new URLSearchParams(window.location.search);
const loadId = params.get("load");
if (loadId) {
  fetch(`/api/share/${encodeURIComponent(loadId)}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.ok && data.code) editor.setValue(data.code);
    })
    .catch(() => {});
}

// File Upload Logic
const fileUpload = document.getElementById("file-upload");
const btnUpload = document.getElementById("btn-upload");

if (btnUpload && fileUpload) {
  btnUpload.addEventListener("click", () => {
    fileUpload.click();
  });

  fileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".phd")) {
      term.textContent = "Error: Only .phd files are allowed to be uploaded.";
      setStatus(false, "Upload Error");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      editor.setValue(e.target.result);
      setStatus(true, "File Loaded");
      term.textContent = `Successfully loaded ${file.name} into the editor.`;
    };
    reader.readAsText(file);

    // Reset input so the same file can be uploaded again if needed
    event.target.value = "";
  });
}

