document.addEventListener("DOMContentLoaded", () => {
  // Navigation scroll effects
  const nav = document.querySelector(".topnav");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for sticky effect
    if (currentScroll > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Hide/show navigation on scroll
    nav.style.transform =
      currentScroll > lastScroll && currentScroll > 100
        ? "translateY(-100%)"
        : "translateY(0)";
    lastScroll = currentScroll;
  });

  // Intersection observer
  const observerOptions = { threshold: 0.5 };
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".topnav a");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      navLinks.forEach((link) => {
        const targetId = link.getAttribute("href").substring(1);
        if (entry.isIntersecting && entry.target.id === targetId) {
          link.classList.add("current-section");
        } else {
          link.classList.remove("current-section");
        }
      });
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Scroll to top
  const scrollTopButton = document.getElementById("scroll-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopButton.style.opacity = "1";
      scrollTopButton.style.visibility = "visible";
    } else {
      scrollTopButton.style.opacity = "0";
      scrollTopButton.style.visibility = "hidden";
    }
  });

  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const text = "CS + UX, side-by-side: designing, prototyping, and shipping responsive products.";
  const typingText = document.getElementById("typing-text");
  let index = 0;

  function type() {
    if (index < text.length) {
      typingText.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, 50);
    }
  }

  type();
});