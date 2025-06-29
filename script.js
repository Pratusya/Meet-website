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

// Enhanced navbar scroll effect with throttling
let ticking = false;

function updateNavbar() {
  const navbar = document.getElementById("navbar");
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Scroll to top button visibility with smooth transition
  if (window.scrollY > 300) {
    scrollToTopBtn.classList.add("visible");
  } else {
    scrollToTopBtn.classList.remove("visible");
  }

  ticking = false;
}

window.addEventListener("scroll", function () {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Enhanced scroll animations with Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -80px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered delay for multiple elements
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.classList.add("animate-in");
      }, index * 100);
    }
  });
}, observerOptions);

// Enhanced observer for different animation types
const observerLeft = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateX(0)";
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

const observerRight = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateX(0)";
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe different elements with different animations
document.querySelectorAll(".section-header, .about-content").forEach((el) => {
  observer.observe(el);
});

// Observe all service cards and feature cards
document
  .querySelectorAll(".service-card, .feature-card, .stat-item, .contact-item")
  .forEach((el) => {
    observer.observe(el);
  });

document.querySelectorAll(".contact-info").forEach((el) => {
  observerLeft.observe(el);
});

document.querySelectorAll(".workshop-showcase").forEach((el) => {
  observerRight.observe(el);
});

// Enhanced parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector(".hero-section");
  const heroBg = document.querySelector(".hero-bg");

  if (heroSection && heroBg && scrolled < window.innerHeight) {
    const rate = scrolled * -0.3;
    heroBg.style.transform = `translateY(${rate}px)`;
  }
});

// Counter animation for statistics
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ""));
    const increment = target / 60; // Smooth animation over 60 frames
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        if (counter.textContent.includes("+")) {
          counter.textContent = Math.ceil(current) + "+";
        } else if (counter.textContent.includes("%")) {
          counter.textContent = Math.ceil(current) + "%";
        } else if (counter.textContent.includes("/")) {
          counter.textContent = Math.ceil(current) + "/7";
        } else {
          counter.textContent = Math.ceil(current);
        }
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  });
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target); // Only animate once
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".about-stats").forEach((el) => {
  statsObserver.observe(el);
});

// Mobile menu functionality
const mobileMenuTog = document.getElementById("mobile-menu-toggle");
const navMenu = document.getElementById("nav-menu");
const hamburger = document.getElementById("hamburger");

// Toggle mobile menu
mobileMenuTog.addEventListener("click", function (e) {
  e.stopPropagation();
  navMenu.classList.toggle("mobile-open");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  if (
    !navMenu.contains(e.target) &&
    !mobileMenuTog.contains(e.target) &&
    navMenu.classList.contains("mobile-open")
  ) {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  }
});

// Close mobile menu on escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && navMenu.classList.contains("mobile-open")) {
    navMenu.classList.remove("mobile-open");
    hamburger.classList.remove("active");
  }
});

// Enhanced click effects with professional ripple
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

// Professional CSS animation for ripple effect
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

// Logo and CNC image error handling
document.addEventListener("DOMContentLoaded", function () {
  // Handle logo images
  document
    .querySelectorAll(".logo-image, .footer-logo-image")
    .forEach((img) => {
      img.onerror = function () {
        this.style.display = "none";
        // Fallback to text logo if image fails to load
        const fallback = document.createElement("div");
        fallback.style.cssText = `
          font-size: 24px; 
          font-weight: 800; 
          color: white; 
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        `;
        fallback.textContent = "GP";
        this.parentNode.appendChild(fallback);
      };
    });

  // Handle CNC machine images (hero section only) with enhanced debugging
  const heroMachineImg = document.querySelector(".hero-machine-image");

  if (heroMachineImg) {
    console.log("CNC Image element found:", heroMachineImg);
    console.log("CNC Image src:", heroMachineImg.src);

    heroMachineImg.onerror = function () {
      console.error("CNC image failed to load from:", this.src);
      // Try alternative path
      if (this.src.includes("Images/")) {
        console.log("Trying alternative path without Images folder...");
        this.src = "CNC.jpg";
      } else {
        console.log("Both paths failed, using fallback background");
        // Fallback to professional gradient background if image fails to load
        this.parentNode.style.background = `
          linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.7)),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dc2626;stop-opacity:0.3' /%3E%3Cstop offset='100%25' style='stop-color:%23f97316;stop-opacity:0.3' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50,200 Q200,50 350,200 Q200,350 50,200' fill='url(%23grad)' /%3E%3Ccircle cx='200' cy='200' r='80' fill='none' stroke='%23dc2626' stroke-width='2' opacity='0.5' /%3E%3Ccircle cx='200' cy='200' r='40' fill='none' stroke='%23f97316' stroke-width='2' opacity='0.7' /%3E%3Ctext x='200' y='320' text-anchor='middle' fill='%23f97316' font-size='24' font-weight='bold'%3ECNC CUTTING%3C/text%3E%3C/svg%3E") center/contain no-repeat
        `;
        this.style.display = "none";
      }
    };

    // Add loading effect with debugging
    heroMachineImg.style.opacity = "0";
    heroMachineImg.onload = function () {
      console.log("CNC image loaded successfully!");
      this.style.transition = "opacity 0.8s ease";
      this.style.opacity = "1";
    };

    // Force check if image is already loaded (cached)
    if (heroMachineImg.complete && heroMachineImg.naturalHeight !== 0) {
      console.log("CNC image was already loaded from cache");
      heroMachineImg.style.opacity = "1";
    }
  } else {
    console.error("CNC image element not found in DOM");
  }

  // Enhanced sparks animation for the cutting effect
  const sparks = document.querySelectorAll(".spark");
  sparks.forEach((spark, index) => {
    setInterval(() => {
      spark.style.animation = "none";
      setTimeout(() => {
        spark.style.animation = `spark-fly 0.8s ease-out ${index * 0.2}s`;
      }, 10);
    }, 3000 + index * 500);
  });

  // Professional page load optimization
  const logoImg = new Image();
  logoImg.src = "Images/logo.jpg";

  const cncImg = new Image();
  cncImg.src = "Images/CNC.jpg";

  // Add professional transitions
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});
