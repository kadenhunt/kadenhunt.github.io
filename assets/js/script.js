document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const overlay = document.querySelector(".overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeButton = document.querySelector(".close-menu");

  if (!mobileMenu || !overlay || !menuToggle) {
    return;
  }

  let lastFocusedElement = null;

  const openMenu = () => {
    lastFocusedElement = document.activeElement;
    mobileMenu.classList.add("active");
    mobileMenu.setAttribute("aria-hidden", "false");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    closeButton?.focus();
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    document.body.style.overflow = "";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
      return;
    }
    openMenu();
  };

  menuToggle.addEventListener("click", toggleMenu);
  closeButton?.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
});
document.querySelectorAll(".expand-button").forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", !isExpanded);
    if (!isExpanded) {
      content.style.maxHeight = `${content.scrollHeight}px`;
      content.classList.add("expanded");
    } else {
      content.style.maxHeight = "0";
      content.classList.remove("expanded");
    }
  });
});
document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;
    const tabContent = document.getElementById(tabId);
    const tabsContainer = button.closest(".project-item");

    // Remove active class from all tabs and contents
    tabsContainer
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    tabsContainer
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to clicked tab and its content
    button.classList.add("active");
    tabContent.classList.add("active");
  });
});
document.querySelectorAll(".code-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and samples
    document
      .querySelectorAll(".code-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".code-sample")
      .forEach((s) => s.classList.remove("active"));

    // Add active class to clicked tab and corresponding sample
    tab.classList.add("active");
    const codeType = tab.getAttribute("data-code");
    document.getElementById(`${codeType}-code`).classList.add("active");
  });
});
function toggleDemo() {
  const gallery = document.getElementById("projectGallery");
  const demo = document.getElementById("projectDemo");
  const toggleBtn = document.querySelector(".project-actions .demo-toggle");

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
