document.addEventListener("DOMContentLoaded", async () => {
  const listEl = document.getElementById("blog-list");
  if (!listEl) return;

  const renderEmpty = (message) => {
    listEl.innerHTML = `<p class="muted">${message}</p>`;
  };

  try {
    const response = await fetch("blog/posts.json", { cache: "no-cache" });
    if (!response.ok) {
      renderEmpty("Posts couldn’t be loaded right now.");
      return;
    }

    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      renderEmpty("No posts yet — check back soon.");
      return;
    }

    const cards = posts
      .map((post) => {
        const title = post?.title || "Untitled";
        const url = post?.url || "#";
        const excerpt = post?.excerpt || "";
        const dateRaw = post?.date || "";

        let dateLabel = dateRaw;
        const parsed = Date.parse(dateRaw);
        if (!Number.isNaN(parsed)) {
          dateLabel = new Date(parsed).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
        }

        return `
          <article class="post-card">
            <p class="post-meta">${dateLabel}</p>
            <h2 class="post-title"><a href="${url}">${title}</a></h2>
            <p class="post-excerpt">${excerpt}</p>
          </article>
        `;
      })
      .join("");

    listEl.innerHTML = cards;
  } catch (e) {
    renderEmpty("Posts couldn’t be loaded. Make sure you’re viewing via a local server (not file://).");
  }
});
