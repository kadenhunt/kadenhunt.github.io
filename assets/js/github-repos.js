document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("repo-list");
  if (!container) return;

  const renderMessage = (message) => {
    container.innerHTML = `<p class="muted">${message}</p>`;
  };

  const repoUrl = (repo) => repo?.html_url || "#";

  try {
    const response = await fetch(
      "https://api.github.com/users/kadenhunt/repos?per_page=100&sort=updated",
      { cache: "no-cache" }
    );

    if (!response.ok) {
      renderMessage("GitHub repos couldn’t be loaded right now.");
      return;
    }

    const repos = await response.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      renderMessage("No public repos found.");
      return;
    }

    // Keep it simple: show the latest 6 non-fork repos.
    const filtered = repos.filter((r) => !r.fork).slice(0, 6);

    const cards = filtered
      .map((repo) => {
        const name = repo?.name || "Untitled";
        const description = repo?.description || "";
        const language = repo?.language || "";
        const stars = typeof repo?.stargazers_count === "number" ? repo.stargazers_count : 0;

        return `
          <article class="repo-card">
            <h3 class="repo-title"><a href="${repoUrl(repo)}" target="_blank" rel="noreferrer">${name}</a></h3>
            <p class="repo-desc">${description}</p>
            <p class="repo-meta">${language ? `<span>${language}</span>` : ""}${language ? " · " : ""}<span>★ ${stars}</span></p>
          </article>
        `;
      })
      .join("");

    container.innerHTML = cards;
  } catch (e) {
    renderMessage("GitHub repos couldn’t be loaded. (This works best over https.)");
  }
});
