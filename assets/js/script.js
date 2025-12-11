document.addEventListener("DOMContentLoaded", () => {
  // Toggle Mobile Menu
  const toggleMenu = () => {
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".overlay");
    const menuToggle = document.querySelector(".menu-toggle");
    const body = document.body;

    if (mobileMenu && overlay) {
      mobileMenu.classList.toggle("active");
      overlay.classList.toggle("active");
      menuToggle.classList.toggle("hidden");
      body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "";
    }
  };

  // Close Mobile Menu on Overlay Click or Escape Key
  const closeMenu = () => {
    const mobileMenu = document.querySelector(".mobile-menu");
    const overlay = document.querySelector(".overlay");
    const menuToggle = document.querySelector(".menu-toggle");

    if (mobileMenu && overlay) {
      mobileMenu.classList.remove("active");
      overlay.classList.remove("active");
      menuToggle.classList.remove("hidden");
      document.body.style.overflow = "";
    }
  };

  // Event Listeners
  document.querySelector(".menu-toggle")?.addEventListener("click", toggleMenu);
  document.querySelector(".close-menu")?.addEventListener("click", closeMenu);
  document.querySelector(".overlay")?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Menu closes when clicking outside on mobile
  document.addEventListener("click", (event) => {
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuToggle = document.querySelector(".menu-toggle");

    if (
      mobileMenu &&
      mobileMenu.classList.contains("active") &&
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
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
