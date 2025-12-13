document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeButton = document.querySelector(".close-menu");

  if (!mobileMenu || !overlay || !menuToggle) return;

  let lastFocusedElement = null;

  const getFocusableElements = (root) => {
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ];
    return Array.from(root.querySelectorAll(selectors.join(","))).filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        el.getAttribute("aria-hidden") !== "true"
    );
  };

  const isMenuOpen = () => mobileMenu.classList.contains("active");

  const openMenu = () => {
    if (isMenuOpen()) return;
    lastFocusedElement = document.activeElement;

    mobileMenu.classList.add("active");
    overlay.classList.add("active");
    menuToggle.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusables = getFocusableElements(mobileMenu);
    (focusables[0] || closeButton || mobileMenu).focus?.();
  };

  const closeMenu = () => {
    if (!isMenuOpen()) return;

    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    menuToggle.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    } else {
      menuToggle.focus();
    }
    lastFocusedElement = null;
  };

  const toggleMenu = () => {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  };

  // Event Listeners
  menuToggle.addEventListener("click", toggleMenu);
  closeButton?.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }

    if (e.key !== "Tab") return;
    if (!isMenuOpen()) return;

    const focusables = getFocusableElements(mobileMenu);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || active === mobileMenu) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Menu closes when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (!isMenuOpen()) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    if (!mobileMenu.contains(target) && !menuToggle.contains(target))
      closeMenu();
  });

  // Expand/collapse sections (used on Projects)
  document.querySelectorAll(".expand-button").forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      if (!content) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));

      if (!isExpanded) {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.classList.add("expanded");
      } else {
        content.style.maxHeight = "0";
        content.classList.remove("expanded");
      }
    });
  });

  // Tabbed content (legacy projects sections)
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab;
      if (!tabId) return;

      const tabContent = document.getElementById(tabId);
      const tabsContainer =
        button.closest(".project-item") || button.closest(".project-card");
      if (!tabContent || !tabsContainer) return;

      tabsContainer
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
      tabsContainer
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));

      button.classList.add("active");
      tabContent.classList.add("active");
    });
  });

  // Code sample tabs (legacy)
  document.querySelectorAll(".code-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".code-tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".code-sample")
        .forEach((s) => s.classList.remove("active"));

      tab.classList.add("active");
      const codeType = tab.getAttribute("data-code");
      const target = codeType
        ? document.getElementById(`${codeType}-code`)
        : null;
      target?.classList.add("active");
    });
  });

  // Copy-to-clipboard helpers
  const toast = (() => {
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
    let timer = null;

    return {
      show(message) {
        el.textContent = message;
        el.classList.add("show");
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => el.classList.remove("show"), 1400);
      },
    };
  })();

  const copyText = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  };

  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.addEventListener("click", async () => {
      const text = el.getAttribute("data-copy") || "";
      if (!text) return;
      const ok = await copyText(text);
      toast.show(ok ? "Copied" : "Copy failed");
    });
  });
});

// Legacy helper (kept safe even if not used)
function toggleDemo() {
  const gallery = document.getElementById("projectGallery");
  const demo = document.getElementById("projectDemo");
  const toggleBtn = document.querySelector(".demo-toggle");

  if (!gallery || !demo || !toggleBtn) return;

  if (gallery.style.display !== "none") {
    gallery.style.display = "none";
    demo.style.display = "block";
    toggleBtn.innerHTML = '<i class="fa fa-image"></i> Show Gallery';
  } else {
    gallery.style.display = "block";
    demo.style.display = "none";
    toggleBtn.innerHTML = '<i class="fa fa-desktop"></i> Toggle Demo';
  }
}
