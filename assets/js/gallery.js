class Gallery {
  constructor(container) {
    this.container = container;
    this.figures = Array.from(
      container.querySelectorAll(".gallery-images figure")
    );
    this.prevBtn = container.querySelector(".gallery-nav.prev");
    this.nextBtn = container.querySelector(".gallery-nav.next");
    this.dotsContainer = container.querySelector(".gallery-dots");
    this.currentIndex = 0;
    this.interval = null;
    this.autoRotateDelay = 5000;

    if (this.figures.length > 0) {
      this.init();
      this.initLightbox();
    }
  }

  init() {
    // Create dots
    this.createDots();

    // Hide all figures initially
    this.figures.forEach((figure) => {
      figure.style.opacity = "0";
      figure.style.visibility = "hidden";
    });

    // Show first figure
    this.showFigure(0);

    // Add event listeners
    this.addEventListeners();

    // Start auto-rotation
    this.startAutoRotate();
  }

  createDots() {
    this.dotsContainer.innerHTML = ""; // Clear existing dots
    this.figures.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Image ${index + 1}`);
      this.dotsContainer.appendChild(dot);
    });
    this.dots = Array.from(this.dotsContainer.querySelectorAll(".dot"));
  }

  showFigure(index) {
    // Hide all figures
    this.figures.forEach((figure) => {
      figure.style.opacity = "0";
      figure.style.visibility = "hidden";
      figure.classList.remove("active");
    });

    // Show selected figure
    this.figures[index].style.opacity = "1";
    this.figures[index].style.visibility = "visible";
    this.figures[index].classList.add("active");

    // Update dots
    this.dots?.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    this.currentIndex = index;
  }

  nextFigure() {
    const newIndex = (this.currentIndex + 1) % this.figures.length;
    this.showFigure(newIndex);
  }

  prevFigure() {
    const newIndex =
      (this.currentIndex - 1 + this.figures.length) % this.figures.length;
    this.showFigure(newIndex);
  }

  startAutoRotate() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => this.nextFigure(), this.autoRotateDelay);
  }

  stopAutoRotate() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = lightbox.querySelector(".lightbox-image");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    // Handle figure/image clicks
    this.figures.forEach((figure) => {
      const img = figure.querySelector("img");
      if (img) {
        img.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add("active");
          this.stopAutoRotate();
          document.body.style.overflow = "hidden";
        });
      }
    });

    // Close lightbox handlers
    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
      this.startAutoRotate();
    };

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  addEventListeners() {
    // Navigation buttons
    this.prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.stopAutoRotate();
      this.prevFigure();
    });

    this.nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      this.stopAutoRotate();
      this.nextFigure();
    });

    // Dot navigation
    this.dots?.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.stopAutoRotate();
        this.showFigure(index);
      });
    });

    // Mouse enter/leave
    this.container.addEventListener("mouseenter", () => this.stopAutoRotate());
    this.container.addEventListener("mouseleave", () => this.startAutoRotate());
  }
}

// Initialize galleries - Update this part in your HTML
document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll(".project-gallery");
  galleries.forEach((gallery) => new Gallery(gallery));
});
