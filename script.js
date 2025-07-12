/*
 * GUJATAT PROFIL - RESPONSIVE JAVASCRIPT
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
    this.initGallery(); // Add gallery initialization
    this.initMap(); // Add map initialization

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
    const navOverlay = document.getElementById("nav-overlay");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.getElementById("navbar");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        this.toggleMobileMenu(navToggle, navMenu);
      });

      // Close mobile menu when clicking on overlay
      if (navOverlay) {
        navOverlay.addEventListener("click", () => {
          this.toggleMobileMenu(navToggle, navMenu);
        });
      }

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
    const overlay = document.getElementById("nav-overlay");

    toggle.classList.toggle("active");
    menu.classList.toggle("active");

    if (overlay) {
      overlay.classList.toggle("active");
    }

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

  // Map Initialization
  initMap() {
    const mapWrapper = document.querySelector(".map-wrapper");
    const iframe = mapWrapper?.querySelector("iframe");

    if (mapWrapper && iframe) {
      // Remove loading state when iframe loads
      iframe.addEventListener("load", () => {
        setTimeout(() => {
          mapWrapper.classList.add("loaded");
        }, 1000); // Small delay to ensure map is fully rendered
      });

      // Also handle error case
      iframe.addEventListener("error", () => {
        mapWrapper.classList.add("loaded");
      });
    }
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

  // Enhanced Gallery System
  initGallery() {
    this.galleryData = this.loadGalleryData();
    this.currentPage = 1;
    this.itemsPerPage = 12; // Show all items on one page
    this.searchQuery = "";

    this.setupGallerySearch();
    this.setupGalleryPagination();
    this.setupLightbox();
    this.renderGallery();
  }

  loadGalleryData() {
    return [
      // Main Products - Single Images Only
      {
        id: 1,
        src: "Images/profile cutting/profile cuting.jfif",
        alt: "Profile Cutting Service",
        title: "Profile Cutting",
        description:
          "High-precision profile cutting solutions for various industrial applications",
        category: "products",
        tags: ["profile", "cutting", "precision", "industrial"],
      },
      {
        id: 2,
        src: "Images/press machine/1.jpeg",
        alt: "Press Machine",
        title: "Press Machine",
        description:
          "Industrial-grade press machines for metal forming and shaping operations",
        category: "products",
        tags: ["press", "metal", "forming", "machine"],
      },
      {
        id: 3,
        src: "Images/scarp pipes/1.jpeg",
        alt: "Profile Cutting Scrap",
        title: "Profile Cutting Scrap",
        description:
          "Quality metal scraps from profile cutting operations for recycling",
        category: "products",
        tags: ["scrap", "recycling", "metal", "cutting"],
      },
      {
        id: 4,
        src: "Images/CNC.jpg",
        alt: "CNC Machine",
        title: "CNC Machine",
        description:
          "State-of-the-art CNC machines for precision manufacturing and cutting",
        category: "products",
        tags: ["cnc", "cutting", "precision", "machine"],
      },
      {
        id: 5,
        src: "Images/genrator/1.jpeg",
        alt: "Diesel Generator",
        title: "Diesel Generator",
        description:
          "Reliable diesel generators for continuous power supply in industrial settings",
        category: "products",
        tags: ["generator", "diesel", "power", "industrial"],
      },
      {
        id: 6,
        src: "Images/Ms scrap/ms scrap.jfif",
        alt: "MS Scrap",
        title: "MS Scrap",
        description:
          "High-quality mild steel scrap materials for recycling and industrial applications",
        category: "products",
        tags: ["ms", "scrap", "steel", "recycling"],
      },
      {
        id: 7,
        src: "Images/ms plates.jpg",
        alt: "MS Plate",
        title: "MS Plate",
        description:
          "High-quality mild steel plates in various sizes for construction projects",
        category: "products",
        tags: ["ms", "plate", "steel", "construction"],
      },
      {
        id: 8,
        src: "Images/scarp pipes/2.jpeg",
        alt: "MS Pipe",
        title: "MS Pipe",
        description:
          "Durable mild steel pipes for plumbing and structural applications",
        category: "products",
        tags: ["ms", "pipe", "steel", "plumbing"],
      },
      {
        id: 9,
        src: "Images/motor scrap/motor.jpg",
        alt: "Motor Scrap",
        title: "Motor Scrap",
        description:
          "Motor scrap collection and recycling services for sustainable practices",
        category: "products",
        tags: ["motor", "scrap", "recycling", "sustainable"],
      },
    ];
  }

  setupGallerySearch() {
    const searchInput = document.getElementById("gallery-search");

    if (searchInput) {
      searchInput.addEventListener(
        "input",
        this.debounce((e) => {
          this.searchQuery = e.target.value.toLowerCase();
          this.currentPage = 1;
          this.renderGallery();
        }, 300)
      );
    }
  }

  setupGalleryPagination() {
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderGallery();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.renderGallery();
        }
      });
    }
  }

  setupLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxClose = document.getElementById("lightbox-close");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");
    const downloadBtn = document.getElementById("download-btn");
    const shareBtn = document.getElementById("share-btn");

    this.currentLightboxIndex = 0;
    this.lightboxImages = [];

    if (lightboxClose) {
      lightboxClose.addEventListener("click", () => this.closeLightbox());
    }

    if (lightbox) {
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          this.closeLightbox();
        }
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener("click", () => this.showPrevImage());
    }

    if (lightboxNext) {
      lightboxNext.addEventListener("click", () => this.showNextImage());
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => this.downloadImage());
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", () => this.shareImage());
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox && lightbox.classList.contains("active")) {
        switch (e.key) {
          case "Escape":
            this.closeLightbox();
            break;
          case "ArrowLeft":
            this.showPrevImage();
            break;
          case "ArrowRight":
            this.showNextImage();
            break;
        }
      }
    });
  }

  getFilteredData() {
    let filtered = this.galleryData;

    // Apply search filter only
    if (this.searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(this.searchQuery) ||
          item.description.toLowerCase().includes(this.searchQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(this.searchQuery))
      );
    }

    return filtered;
  }

  getTotalPages() {
    const filteredData = this.getFilteredData();
    return Math.ceil(filteredData.length / this.itemsPerPage);
  }

  renderGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    const currentPageSpan = document.getElementById("current-page");
    const totalPagesSpan = document.getElementById("total-pages");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (!galleryGrid) return;

    const filteredData = this.getFilteredData();
    const totalPages = this.getTotalPages();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    // Update pagination info
    if (currentPageSpan) currentPageSpan.textContent = this.currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;

    // Update pagination buttons
    if (prevBtn) {
      prevBtn.disabled = this.currentPage === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    // Store current images for lightbox
    this.lightboxImages = filteredData;

    // Show loading state
    galleryGrid.innerHTML = `
      <div class="gallery-loading">
        <div class="gallery-loading-spinner"></div>
        <div class="gallery-loading-text">Loading gallery...</div>
      </div>
    `;

    // Simulate loading delay for better UX
    setTimeout(() => {
      if (pageData.length === 0) {
        galleryGrid.innerHTML = `
          <div class="gallery-empty">
            <div class="gallery-empty-icon">
              <i class="fas fa-images"></i>
            </div>
            <div class="gallery-empty-text">No images found</div>
            <div class="gallery-empty-subtext">
              Try adjusting your search terms
            </div>
          </div>
        `;
        return;
      }

      galleryGrid.innerHTML = pageData
        .map(
          (item, index) => `
        <div class="gallery-item" data-category="${
          item.category
        }" data-aos="fade-up" data-aos-delay="${index * 100}">
          <div class="gallery-image-container">
            <img src="${item.src}" alt="${
            item.alt
          }" class="gallery-image" loading="lazy" />
            <div class="gallery-category">${this.getCategoryName(
              item.category
            )}</div>
            <div class="gallery-overlay">
              <div class="gallery-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="gallery-actions">
                  <button class="gallery-action-btn" onclick="window.gujaratProfil.openLightbox(${filteredData.indexOf(
                    item
                  )})" title="View Image">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="gallery-action-btn" onclick="window.gujaratProfil.downloadImage('${
                    item.src
                  }', '${item.title}')" title="Download">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="gallery-info">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>
        </div>
      `
        )
        .join("");

      // Reinitialize AOS for new elements
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    }, 500);
  }

  getCategoryName(category) {
    const categoryNames = {
      products: "Our Products",
    };
    return categoryNames[category] || "Products";
  }

  openLightbox(index) {
    const lightbox = document.getElementById("gallery-lightbox");
    if (!lightbox || !this.lightboxImages[index]) return;

    this.currentLightboxIndex = index;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";

    this.updateLightboxContent();
  }

  closeLightbox() {
    const lightbox = document.getElementById("gallery-lightbox");
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  showPrevImage() {
    if (this.currentLightboxIndex > 0) {
      this.currentLightboxIndex--;
      this.updateLightboxContent();
    }
  }

  showNextImage() {
    if (this.currentLightboxIndex < this.lightboxImages.length - 1) {
      this.currentLightboxIndex++;
      this.updateLightboxContent();
    }
  }

  updateLightboxContent() {
    const image = this.lightboxImages[this.currentLightboxIndex];
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDescription = document.getElementById("lightbox-description");
    const lightboxPrev = document.getElementById("lightbox-prev");
    const lightboxNext = document.getElementById("lightbox-next");

    if (lightboxImage) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
    }

    if (lightboxTitle) {
      lightboxTitle.textContent = image.title;
    }

    if (lightboxDescription) {
      lightboxDescription.textContent = image.description;
    }

    // Update navigation buttons
    if (lightboxPrev) {
      lightboxPrev.style.display =
        this.currentLightboxIndex === 0 ? "none" : "flex";
    }

    if (lightboxNext) {
      lightboxNext.style.display =
        this.currentLightboxIndex === this.lightboxImages.length - 1
          ? "none"
          : "flex";
    }
  }

  downloadImage(src = null, title = null) {
    const image = src
      ? { src, title }
      : this.lightboxImages[this.currentLightboxIndex];
    if (!image) return;

    const link = document.createElement("a");
    link.href = image.src;
    link.download = `${image.title || "image"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification("Image download started", "success");
  }

  shareImage() {
    const image = this.lightboxImages[this.currentLightboxIndex];
    if (!image) return;

    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      const url = `${window.location.origin}${window.location.pathname}#gallery`;
      navigator.clipboard.writeText(url).then(() => {
        this.showNotification("Gallery URL copied to clipboard", "success");
      });
    }
  }

  // Enhanced search functionality
  performAdvancedSearch(query) {
    return this.galleryData.filter((item) => {
      const searchTerms = query.toLowerCase().split(" ");
      return searchTerms.every(
        (term) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
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

// Service Worker Registration (Progressive Web App capabilities)
// Uncomment the code below if you want PWA features like offline caching
/*
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content available! Please refresh.');
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}
*/

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

// Error handling - improved to prevent JSON parse errors
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error);
  // Prevent error propagation for external content
  if (e.filename && e.filename.includes("content.js")) {
    e.preventDefault();
    return false;
  }
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Promise Rejection:", e.reason);
  // Prevent error propagation for external content
  if (
    e.reason &&
    typeof e.reason === "string" &&
    e.reason.includes("content.js")
  ) {
    e.preventDefault();
    return false;
  }
});

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage access failed:", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn("localStorage write failed:", e);
      return false;
    }
  },
};

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
    const currentTheme = safeLocalStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);

    toggleButton.addEventListener("click", () => {
      const theme = document.documentElement.getAttribute("data-theme");
      const newTheme = theme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      safeLocalStorage.setItem("theme", newTheme);
    });
  }
};

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GujaratProfilWebsite, InteractiveFeatures };
}
