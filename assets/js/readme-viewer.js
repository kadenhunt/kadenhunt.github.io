(function () {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("path");

  const titleEl = document.getElementById("readme-title");
  const statusEl = document.getElementById("readme-status");
  const contentEl = document.getElementById("readme-content");

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function isSafeReadmePath(value) {
    if (!value) return false;
    if (value.includes("..")) return false;
    if (value.startsWith("/")) return false;
    if (!value.startsWith("projects/")) return false;
    if (!value.toLowerCase().endsWith(".md")) return false;
    return true;
  }

  function getBaseDir(value) {
    const idx = value.lastIndexOf("/");
    return idx === -1 ? "" : value.slice(0, idx + 1);
  }

  function isRelativeUrl(href) {
    if (!href) return false;
    if (href.startsWith("#")) return false;
    if (href.startsWith("/")) return false;
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(href)) return false;
    return true;
  }

  function rewriteRelativeUrls(container, baseDir) {
    container.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (isRelativeUrl(src)) img.setAttribute("src", baseDir + src);
    });

    container.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");
      if (isRelativeUrl(href)) a.setAttribute("href", baseDir + href);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
  }

  async function run() {
    if (!isSafeReadmePath(path)) {
      titleEl.textContent = "README";
      setStatus("Missing or invalid README path.");
      return;
    }

    titleEl.textContent = "README";
    setStatus("Loading…");

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const markdown = await res.text();

      const baseDir = getBaseDir(path);

      // marked + DOMPurify are loaded from CDNs in the page.
      const html = window.marked.parse(markdown, {
        gfm: true,
        breaks: false,
        headerIds: true,
        mangle: false,
      });

      const clean = window.DOMPurify.sanitize(html);
      contentEl.innerHTML = clean;
      rewriteRelativeUrls(contentEl, baseDir);

      setStatus("");
    } catch (err) {
      setStatus("Could not load this README.");
    }
  }

  run();
})();
