// Loading Screen
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("fade-out");
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1000);
});

// Mobile menu functionality
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");

// Toggle mobile menu
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    navMenu.classList.toggle("mobile-open");
    hamburger.classList.toggle("active");
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    if (navMenu.classList.contains("mobile-open")) {
      navMenu.classList.remove("mobile-open");
      hamburger.classList.remove("active");
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  if (
    navMenu &&
    !navMenu.contains(e.target) &&
    !mobileMenuToggle.contains(e.target) &&
    navMenu.classList.contains("mobile-open")
  ) {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  }
});

// Close mobile menu on escape key
document.addEventListener("keydown", function (e) {
  if (
    e.key === "Escape" &&
    navMenu &&
    navMenu.classList.contains("mobile-open")
  ) {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById("scroll-to-top");
if (scrollToTopBtn) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(100px)";
    }
  });

  scrollToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Animation on scroll for cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all cards for animation
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(
    ".service-card, .feature-card, .stat-item, .contact-item"
  );
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
});

// Enhanced click effects with ripple
document
  .querySelectorAll(
    ".btn-primary, .btn-secondary, .service-card, .feature-card"
  )
  .forEach((element) => {
    element.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-effect 0.6s linear;
      pointer-events: none;
      z-index: 10;
    `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

// CSS animation for ripple effect
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple-effect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Image error handling
document.addEventListener("DOMContentLoaded", function () {
  // Handle logo images
  document
    .querySelectorAll(".logo-image, .footer-logo-image")
    .forEach((img) => {
      img.onerror = function () {
        this.style.display = "none";
        const fallback = document.createElement("div");
        fallback.style.cssText = `
        font-size: 24px; 
        font-weight: 800; 
        color: #dc2626; 
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f8fafc;
        border-radius: 12px;
      `;
        fallback.textContent = "GP";
        this.parentNode.appendChild(fallback);
      };
    });

  // Handle CNC machine image
  const heroMachineImg = document.querySelector(".hero-machine-image");
  if (heroMachineImg) {
    heroMachineImg.onerror = function () {
      this.parentNode.style.background = `
        linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.7)),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dc2626;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23f97316;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50,200 Q200,50 350,200 Q200,350 50,200' fill='url(%23grad)' /%3E%3Ccircle cx='200' cy='200' r='80' fill='none' stroke='%23dc2626' stroke-width='2' opacity='0.5' /%3E%3Ccircle cx='200' cy='200' r='40' fill='none' stroke='%23f97316' stroke-width='2' opacity='0.7' /%3E%3Ctext x='200' y='320' text-anchor='middle' fill='%23f97316' font-size='24' font-weight='bold'%3ECNC CUTTING%3C/text%3E%3C/svg%3E") center/contain no-repeat
      `;
      this.style.display = "none";
    };

    // Add loading effect
    heroMachineImg.style.opacity = "0";
    heroMachineImg.onload = function () {
      this.style.transition = "opacity 0.8s ease";
      this.style.opacity = "1";
    };
  }
});

// Responsive utilities
function handleResize() {
  const isMobile = window.innerWidth <= 768;

  // Adjust mobile menu behavior
  if (!isMobile && navMenu && navMenu.classList.contains("mobile-open")) {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  }
}

window.addEventListener("resize", handleResize);

// Initialize scroll to top button
if (scrollToTopBtn) {
  scrollToTopBtn.style.opacity = "0";
  scrollToTopBtn.style.transform = "translateY(100px)";
  scrollToTopBtn.style.transition = "all 0.3s ease";
}

// Performance optimization: Debounce scroll events
let scrollTimeout;
function debounceScroll(func, delay) {
  return function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(func, delay);
  };
}

// Enhanced scroll performance
const debouncedScrollHandler = debounceScroll(() => {
  const scrolled = window.scrollY > 300;
  if (scrollToTopBtn) {
    scrollToTopBtn.style.opacity = scrolled ? "1" : "0";
    scrollToTopBtn.style.transform = scrolled
      ? "translateY(0)"
      : "translateY(100px)";
  }
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);
