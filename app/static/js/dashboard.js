/* global Chart */

async function requireAuth() {
  const res = await fetch("/api/me");
  const data = await res.json();
  if (!data.authenticated) {
    window.location.href = "/login";
    return null;
  }
  return data;
}

function renderTimeline(items) {
  const root = document.getElementById("timeline");
  const empty = document.getElementById("timeline-empty");
  root.innerHTML = "";
  if (!items.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  for (const row of items) {
    const el = document.createElement("div");
    el.className = "timeline-item";
    el.innerHTML = `
      <span class="timeline-dot ${row.success ? "ok" : "err"}"></span>
      <div class="timeline-body">
        <code>${escapeHtml(row.code)}</code>
        <div class="timeline-meta">${row.created_at || ""} · ${row.execution_time_ms?.toFixed?.(2) ?? row.execution_time_ms} ms</div>
      </div>
      <button type="button" class="btn btn-small btn-ghost" data-rerun="${row.id}">Rerun</button>
    `;
    root.appendChild(el);
  }
  root.querySelectorAll("[data-rerun]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-rerun"));
      const row = items.find((x) => x.id === id);
      if (row) {
        sessionStorage.setItem("pahadi_rerun_code", row.code);
        window.location.href = "/editor";
      }
    });
  });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let pieChart;
let barChart;

let lineChart;

let timeChart;

function buildCharts(summary, daily) {
  const pieCtx = document.getElementById("chart-pie");
  const runsCtx = document.getElementById("chart-runs");
  const timeCtx = document.getElementById("chart-time");
  
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();
  if (timeChart) timeChart.destroy();

  pieChart = new Chart(pieCtx, {
    type: "doughnut",
    data: {
      labels: ["Success", "Failure"],
      datasets: [
        {
          data: [summary.successes, summary.failures],
          backgroundColor: ["rgba(123, 237, 159, 0.85)", "rgba(255, 107, 138, 0.85)"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 2.5,
      plugins: { legend: { labels: { color: "#c9d2e5" } } },
    },
  });

  const labels = daily.map((d) => d.date);

  barChart = new Chart(runsCtx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Success",
          data: daily.map((d) => d.success),
          borderColor: "rgba(123, 237, 159, 0.9)",
          backgroundColor: "rgba(123, 237, 159, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Failure",
          data: daily.map((d) => d.failure),
          borderColor: "rgba(255, 107, 138, 0.9)",
          backgroundColor: "rgba(255, 107, 138, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 5,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.06)" }, beginAtZero: true },
      },
      plugins: { legend: { labels: { color: "#c9d2e5" } } },
    },
  });

  timeChart = new Chart(timeCtx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Execution (ms)",
          data: daily.map((d) => d.total_execution_ms),
          borderColor: "rgba(255, 204, 0, 0.9)",
          backgroundColor: "rgba(255, 204, 0, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Avg Execution (ms)",
          data: daily.map((d) => d.avg_execution_ms),
          borderColor: "rgba(61, 214, 198, 0.9)",
          backgroundColor: "rgba(61, 214, 198, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ],
    },
    options: {
      responsive: true,
      aspectRatio: 5,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#8b95a8" }, grid: { color: "rgba(255,255,255,0.06)" }, beginAtZero: true },
      },
      plugins: { legend: { labels: { color: "#c9d2e5" } } },
    },
  });

  const totalEl = document.getElementById("stat-total");
  const rateEl = document.getElementById("stat-rate");
  const timeEl = document.getElementById("stat-time");
  if (totalEl) totalEl.textContent = summary.total_runs;
  if (rateEl) rateEl.textContent = (summary.success_rate * 100).toFixed(1) + "%";
  if (timeEl) timeEl.textContent = summary.avg_execution_ms.toFixed(1) + "ms";
}

document.addEventListener("DOMContentLoaded", async () => {
  const auth = await requireAuth();
  if (!auth) return;
  const [histRes, anaRes] = await Promise.all([fetch("/api/history"), fetch("/api/analytics")]);
  const hist = await histRes.json();
  const ana = await anaRes.json();
  if (hist.ok) renderTimeline(hist.items);
  if (ana.ok) buildCharts(ana.summary, ana.daily);
});
