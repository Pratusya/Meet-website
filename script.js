/*
 * GUJARAT PROFIL - RESPONSIVE JAVASCRIPT
 * Advanced Interactive Features & Device Detection
 */

class GujaratProfilWebsite {
  constructor() {
    this.isTouch = this.detectTouchDevice();
    this.currentBreakpoint = this.getCurrentBreakpoint();
    this.scrolled = false;
    this.animationObserver = null;
    this.lastScrollY = 0;
    this.isScrollingDown = false;

    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners()
      );
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Core functionality
    this.initNavigation();
    this.initSmoothScrolling();
    this.initScrollEffects();
    this.initAnimations();
    this.initResponsiveFeatures();
    this.initLoadingScreen();
    this.initBackToTop();

    // Performance optimized event listeners
    this.setupOptimizedListeners();

    // Initialize AOS if available
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 100,
        disable: this.isTouch ? "mobile" : false,
      });
    }
  }

  // Device Detection
  detectTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= 480) return "mobile";
    if (width <= 768) return "large-mobile";
    if (width <= 1024) return "tablet";
    if (width <= 1200) return "tablet-landscape";
    if (width <= 1440) return "desktop";
    return "large-desktop";
  }

  // Navigation
  initNavigation() {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        this.toggleMobileMenu(navToggle, navMenu);
      });

      // Close mobile menu when clicking on links
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (navMenu.classList.contains("active")) {
            this.toggleMobileMenu(navToggle, navMenu);
          }
        });
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !navbar.contains(e.target) &&
          navMenu.classList.contains("active")
        ) {
          this.toggleMobileMenu(navToggle, navMenu);
        }
      });
    }

    // Active link highlighting
    this.updateActiveNavLink();
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.updateActiveNavLink();
      }, 100)
    );
  }

  toggleMobileMenu(toggle, menu) {
    toggle.classList.toggle("active");
    menu.classList.toggle("active");

    // Prevent body scroll when menu is open
    if (menu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let currentSection = "";
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Smooth Scrolling
  initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Scroll Effects
  initScrollEffects() {
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        const currentScrollY = window.pageYOffset;

        // Scroll direction detection
        this.isScrollingDown = currentScrollY > this.lastScrollY;
        this.lastScrollY = currentScrollY;

        // Parallax effects disabled for better performance and visual stability
        // if (
        //   this.currentBreakpoint !== "mobile" &&
        //   this.currentBreakpoint !== "large-mobile"
        // ) {
        //   this.updateParallaxEffects();
        // }
      }, 16)
    ); // 60fps throttling
  }

  updateParallaxEffects() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector(".hero-bg-img");

    if (heroBackground) {
      const rate = scrolled * -0.5;
      heroBackground.style.transform = `translateY(${rate}px)`;
    }
  }

  // Animations
  initAnimations() {
    // Intersection Observer for scroll animations
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const animateElements = document.querySelectorAll(
      ".service-card, .feature-card, .contact-item"
    );

    if ("IntersectionObserver" in window) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      this.animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, observerOptions);

      animateElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition =
          "opacity 0.8s ease-out, transform 0.8s ease-out";
        this.animationObserver.observe(element);
      });
    }
  }

  // Form Handling
  // Responsive Features
  initResponsiveFeatures() {
    // Handle orientation changes
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.handleBreakpointChange();
      }, 100);
    });

    // Handle resize with debouncing
    window.addEventListener(
      "resize",
      this.debounce(() => {
        const newBreakpoint = this.getCurrentBreakpoint();
        if (newBreakpoint !== this.currentBreakpoint) {
          this.currentBreakpoint = newBreakpoint;
          this.handleBreakpointChange();
        }
      }, 250)
    );

    // Touch-specific enhancements
    if (this.isTouch) {
      this.initTouchEnhancements();
    }
  }

  handleBreakpointChange() {
    // Update logo size based on breakpoint
    const logo = document.querySelector(".logo-img");
    if (logo) {
      const sizes = {
        mobile: "35px",
        "large-mobile": "40px",
        tablet: "45px",
        "tablet-landscape": "50px",
        desktop: "50px",
        "large-desktop": "60px",
      };
      logo.style.height = sizes[this.currentBreakpoint] || "50px";
    }

    // Re-initialize AOS for breakpoint changes
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  initTouchEnhancements() {
    // Add touch classes
    document.body.classList.add("touch-device");

    // Enhanced touch interactions for service cards
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card) => {
      card.addEventListener("touchstart", () => {
        card.style.transform = "scale(0.98)";
      });

      card.addEventListener("touchend", () => {
        card.style.transform = "";
      });
    });

    // Swipe gesture for mobile navigation
    this.initSwipeGestures();
  }

  initSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    document.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      this.handleSwipe();
    });
  }

  handleSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;
    const minSwipeDistance = 50;

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > minSwipeDistance
    ) {
      const navToggle = document.getElementById("nav-toggle");
      const navMenu = document.getElementById("nav-menu");

      if (deltaX > 0 && !navMenu.classList.contains("active")) {
        // Swipe right - open menu
        this.toggleMobileMenu(navToggle, navMenu);
      } else if (deltaX < 0 && navMenu.classList.contains("active")) {
        // Swipe left - close menu
        this.toggleMobileMenu(navToggle, navMenu);
      }
    }
  }

  // Loading Screen
  initLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    window.addEventListener("load", () => {
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 1000);
    });
  }

  // Back to Top Button
  initBackToTop() {
    const backToTopButton = document.getElementById("back-to-top");
    if (!backToTopButton) return;

    window.addEventListener(
      "scroll",
      this.throttle(() => {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      }, 100)
    );

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Performance Optimized Event Listeners
  setupOptimizedListeners() {
    // Lazy load images
    this.initLazyLoading();

    // Optimize animations based on device performance
    this.optimizeForPerformance();
  }

  initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach((img) => {
        img.src = img.dataset.src;
      });
    }
  }

  optimizeForPerformance() {
    // Reduce animations on low-end devices
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (connection && connection.effectiveType === "slow-2g") {
      document.body.classList.add("reduced-motion");
    }

    // Disable parallax on mobile for better performance
    if (this.isTouch || this.currentBreakpoint === "mobile") {
      document.body.classList.add("no-parallax");
    }
  }

  // Utility Functions
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Notification System
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success" ? "var(--primary-color)" : "var(--dark-card)"
            };
            color: var(--text-light);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }

  // Public API
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }

  getCurrentBreakpoint() {
    return this.currentBreakpoint;
  }

  isTouch() {
    return this.isTouch;
  }
}

// Additional Interactive Features
class InteractiveFeatures {
  constructor() {
    this.initServiceCardInteractions();
    this.initImageGallery();
    this.initSearchFunctionality();
  }

  initServiceCardInteractions() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
      // Add subtle tilt effect on hover (desktop only)
      if (!window.gujaratProfil.isTouch) {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = (y - centerY) / 20;
          const rotateY = (centerX - x) / 20;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      }
    });
  }

  initImageGallery() {
    const images = document.querySelectorAll(".about-img, .hero-bg-img");

    images.forEach((img) => {
      img.addEventListener("click", () => {
        this.openLightbox(img.src, img.alt);
      });
    });
  }

  openLightbox(src, alt) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-content">
                    <img src="${src}" alt="${alt}" class="lightbox-image">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

    // Add styles
    lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = "hidden";

    // Animate in
    setTimeout(() => {
      lightbox.style.opacity = "1";
    }, 10);

    // Close functionality
    const closeButton = lightbox.querySelector(".lightbox-close");
    const overlay = lightbox.querySelector(".lightbox-overlay");

    [closeButton, overlay].forEach((element) => {
      element.addEventListener("click", (e) => {
        if (e.target === element) {
          this.closeLightbox(lightbox);
        }
      });
    });

    // ESC key to close
    const escapeHandler = (e) => {
      if (e.key === "Escape") {
        this.closeLightbox(lightbox);
        document.removeEventListener("keydown", escapeHandler);
      }
    };
    document.addEventListener("keydown", escapeHandler);
  }

  closeLightbox(lightbox) {
    lightbox.style.opacity = "0";
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.remove();
    }, 300);
  }

  initSearchFunctionality() {
    // Add search functionality for services (if needed)
    const searchInput = document.getElementById("service-search");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce((e) => {
          this.filterServices(e.target.value);
        }, 300)
      );
    }
  }

  filterServices(query) {
    const serviceCards = document.querySelectorAll(".service-card");
    const normalizedQuery = query.toLowerCase().trim();

    serviceCards.forEach((card) => {
      const title = card
        .querySelector(".service-title")
        .textContent.toLowerCase();
      const description = card
        .querySelector(".service-description")
        .textContent.toLowerCase();

      const matches =
        title.includes(normalizedQuery) ||
        description.includes(normalizedQuery);

      card.style.display = matches ? "block" : "none";

      if (matches) {
        card.style.animation = "fadeInUp 0.5s ease forwards";
      }
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize everything when the script loads
document.addEventListener("DOMContentLoaded", () => {
  // Main website functionality
  window.gujaratProfil = new GujaratProfilWebsite();

  // Additional interactive features
  window.interactiveFeatures = new InteractiveFeatures();

  // Global utilities
  window.gujaratProfilUtils = {
    scrollToSection: (id) => window.gujaratProfil.scrollToSection(id),
    showNotification: (msg, type) =>
      window.gujaratProfil.showNotification(msg, type),
    getCurrentBreakpoint: () => window.gujaratProfil.getCurrentBreakpoint(),
  };
});

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Performance monitoring
if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "largest-contentful-paint") {
        console.log("LCP:", entry.startTime);
      }
    });
  });

  observer.observe({ entryTypes: ["largest-contentful-paint"] });
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error);
  // You could send this to an error reporting service
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
  // You could send this to an error reporting service
});

// Accessibility enhancements
document.addEventListener("keydown", (e) => {
  // Skip navigation for screen readers
  if (
    e.key === "Tab" &&
    e.shiftKey &&
    document.activeElement === document.body
  ) {
    const firstFocusable = document.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
});

// Dark mode toggle (future enhancement)
const initDarkModeToggle = () => {
  const toggleButton = document.getElementById("dark-mode-toggle");
  if (toggleButton) {
    const currentTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);

    toggleButton.addEventListener("click", () => {
      const theme = document.documentElement.getAttribute("data-theme");
      const newTheme = theme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GujaratProfilWebsite, InteractiveFeatures };
}
