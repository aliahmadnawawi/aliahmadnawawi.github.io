const projectsGrid = document.getElementById("projects-grid");

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
