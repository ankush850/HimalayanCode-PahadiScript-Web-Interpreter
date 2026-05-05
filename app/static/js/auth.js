async function refreshNavAuth() {
  const login = document.getElementById("nav-login");
  const reg = document.getElementById("nav-register");
  const logout = document.getElementById("nav-logout");
  const userEl = document.getElementById("nav-user");
  if (!login || !reg || !logout || !userEl) return;
  try {
    const res = await fetch("/api/me");
    const data = await res.json();
    if (data.authenticated) {
      userEl.textContent = data.user.username;
      userEl.classList.remove("hidden");
      login.classList.add("hidden");
      reg.classList.add("hidden");
      logout.classList.remove("hidden");
    } else {
      userEl.classList.add("hidden");
      login.classList.remove("hidden");
      reg.classList.remove("hidden");
      logout.classList.add("hidden");
    }
  } catch {
    /* ignore */
  }
  logout.onclick = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  };
}

document.addEventListener("DOMContentLoaded", refreshNavAuth);
