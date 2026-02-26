// ✅ Your .NET API base url:
const API_BASE = "https://localhost:7166";

const els = {
  rows: document.getElementById("rows"),
  state: document.getElementById("state"),
  refresh: document.getElementById("btn-refresh"),

  createForm: document.getElementById("create-form"),
  createError: document.getElementById("create-error"),

  search: document.getElementById("search"),
  statusFilter: document.getElementById("status-filter"),

  modal: document.getElementById("modal"),
  modalClose: document.getElementById("modal-close"),
  editForm: document.getElementById("edit-form"),
  editError: document.getElementById("edit-error"),
  cancel: document.getElementById("btn-cancel"),
};

let allItems = [];
let filtered = [];

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(raw) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) return `https://${s}`;
  return s;
}

function toDateInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function statusDotClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "applied") return "applied";
  if (s === "interview") return "interview";
  if (s === "offer") return "offer";
  if (s === "rejected") return "rejected";
  return "";
}

function badge(status) {
  const cls = statusDotClass(status);
  const safe = escapeHtml(status || "Applied");
  return `<span class="badge"><span class="dot ${cls}"></span>${safe}</span>`;
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return await res.json();
}

function setState(text) {
  els.state.textContent = text;
}

async function load() {
  setState("Loading...");
  try {
    const data = await api("/api/applications");
    allItems = Array.isArray(data) ? data : [];
    applyFilters();
    setState(allItems.length ? "" : "No applications yet. Add your first one 👆");
  } catch (err) {
    console.error(err);
    setState("Failed to load. Check API_BASE and that backend is running.");
  }
}

function applyFilters() {
  const q = els.search.value.trim().toLowerCase();
  const st = els.statusFilter.value;

  filtered = allItems
    .filter(x => {
      if (st && String(x.status) !== st) return false;
      if (!q) return true;
      return (
        String(x.company || "").toLowerCase().includes(q) ||
        String(x.position || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.appliedOn ?? 0) - new Date(a.appliedOn ?? 0));

  render();
}

function render() {
  els.rows.innerHTML = filtered.map(item => {
    const company = escapeHtml(item.company);
    const position = escapeHtml(item.position);
    const status = badge(item.status);
    const applied = escapeHtml(toDateInputValue(item.appliedOn));

    const safeHref = item.link ? normalizeUrl(item.link) : null;
    const link = safeHref
      ? `<div class="muted" style="margin-top:6px;">
           <a href="${escapeHtml(safeHref)}" target="_blank" rel="noreferrer" style="color:#9ec1ff;">Open link</a>
         </div>`
      : "";

    const notes = item.notes
      ? `<div class="muted" style="margin-top:6px;">${escapeHtml(item.notes)}</div>`
      : "";

    return `
      <tr>
        <td>
          <div style="font-weight:700;">${company}</div>
          ${link}
        </td>
        <td>
          <div>${position}</div>
          ${notes}
        </td>
        <td>${status}</td>
        <td>${applied}</td>
        <td class="right">
          <button class="btn" data-edit="${item.id}">Edit</button>
          <button class="btn danger" data-del="${item.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join("");

  els.rows.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => openEdit(Number(btn.dataset.edit)));
  });
  els.rows.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => onDelete(Number(btn.dataset.del)));
  });
}

async function onCreate(e) {
  e.preventDefault();
  els.createError.textContent = "";

  const fd = new FormData(els.createForm);

  const dto = {
    company: fd.get("company"),
    position: fd.get("position"),
    status: fd.get("status"),
    link: normalizeUrl(fd.get("link")),
    notes: fd.get("notes") || null,
  };

  const dateValue = String(fd.get("appliedOn") || "").trim();
  if (dateValue) {
    dto.appliedOn = new Date(dateValue + "T00:00:00").toISOString();
  }

  try {
    const created = await api("/api/applications", {
      method: "POST",
      body: JSON.stringify(dto),
    });

    allItems.unshift(created);
    els.createForm.reset();
    applyFilters();
    setState("");
  } catch (err) {
    els.createError.textContent = String(err.message || err);
  }
}

function openEdit(id) {
  const item = allItems.find(x => x.id === id);
  if (!item) return;

  els.editError.textContent = "";
  const f = els.editForm;

  f.id.value = item.id;
  f.company.value = item.company || "";
  f.position.value = item.position || "";
  f.status.value = item.status || "Applied";
  f.appliedOn.value = toDateInputValue(item.appliedOn);
  f.link.value = item.link || "";
  f.notes.value = item.notes || "";

  els.modal.classList.remove("hidden");
  els.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  els.modal.classList.add("hidden");
  els.modal.setAttribute("aria-hidden", "true");
}

async function onEditSubmit(e) {
  e.preventDefault();
  els.editError.textContent = "";

  const fd = new FormData(els.editForm);
  const id = Number(fd.get("id"));

  const dto = {
    id,
    company: fd.get("company"),
    position: fd.get("position"),
    status: fd.get("status"),
    link: normalizeUrl(fd.get("link")),
    notes: fd.get("notes") || null,
  };

  const dateValue = String(fd.get("appliedOn") || "").trim();
  if (dateValue) {
    dto.appliedOn = new Date(dateValue + "T00:00:00").toISOString();
  }

  try {
    await api(`/api/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    });

    const idx = allItems.findIndex(x => x.id === id);
    if (idx !== -1) {
      allItems[idx] = { ...allItems[idx], ...dto };
    }
    applyFilters();
    closeModal();
  } catch (err) {
    els.editError.textContent = String(err.message || err);
  }
}

async function onDelete(id) {
  const item = allItems.find(x => x.id === id);
  const label = item ? `${item.company} - ${item.position}` : `#${id}`;
  if (!confirm(`Delete application: ${label}?`)) return;

  try {
    await api(`/api/applications/${id}`, { method: "DELETE" });
    allItems = allItems.filter(x => x.id !== id);
    applyFilters();
    if (!allItems.length) setState("No applications yet. Add your first one 👆");
  } catch (err) {
    alert(String(err.message || err));
  }
}

// Events
els.createForm.addEventListener("submit", onCreate);
els.refresh.addEventListener("click", load);
els.search.addEventListener("input", applyFilters);
els.statusFilter.addEventListener("change", applyFilters);

els.modalClose.addEventListener("click", closeModal);
els.cancel.addEventListener("click", closeModal);
els.modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
els.editForm.addEventListener("submit", onEditSubmit);

// Start
load();