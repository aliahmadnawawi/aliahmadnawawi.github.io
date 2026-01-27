const projectsGrid = document.getElementById("projects-grid");
const themeToggle = document.getElementById("theme-toggle");
const backToTop = document.getElementById("back-to-top");
const storageKey = "aan-theme";

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem(storageKey);
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const renderProjects = (projects) => {
  projectsGrid.innerHTML = "";
  projects.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description yet."}</p>
      <div class="project-meta">
        <span>${repo.language || "Mixed"}</span>
        <span>★ ${repo.stargazers_count}</span>
        <span>${formatDate(repo.updated_at)}</span>
      </div>
      <div class="section-actions">
        <a class="btn ghost" href="${repo.html_url}" target="_blank">Lihat Repo</a>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
};

const loadProjects = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/users/aliahmadnawawi/repos?per_page=8&sort=updated"
    );
    if (!response.ok) {
      throw new Error("Gagal memuat data GitHub");
    }
    const data = await response.json();
    const filtered = data
      .filter((repo) => !repo.fork)
      .slice(0, 6);
    renderProjects(filtered);
  } catch (error) {
    projectsGrid.innerHTML = `
      <div class="card loading">
        Sorry, GitHub data couldn't be loaded. Please check GitHub directly.
      </div>
    `;
  }
};

loadProjects();

const preferredTheme = getPreferredTheme();
setTheme(preferredTheme);

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem(storageKey, next);
  setTheme(next);
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  if (!localStorage.getItem(storageKey)) {
    setTheme(event.matches ? "dark" : "light");
  }
});

const toggleBackToTop = () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
};

window.addEventListener("scroll", toggleBackToTop);
toggleBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
