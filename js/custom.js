(function() {
  "use strict";

  // ---- PARTICLES ----
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  for (let i = 0; i < 100; i++) particles.push(createParticle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ---- NAVBAR TOGGLE ----
  const toggler = document.getElementById("navToggler");
  const menu = document.getElementById("navMenu");
  if (toggler) {
    toggler.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // ---- NAVBAR SCROLL ----
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (window.scrollY > 50) {
      nav.style.padding = "0.6rem 3rem";
    } else {
      nav.style.padding = "1rem 3rem";
    }
    // back to top
    const btt = document.getElementById("backToTop");
    if (btt) btt.classList.toggle("visible", window.scrollY > 400);
  });

  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute("id");
    });
    navLinks.forEach(l => {
      l.classList.remove("active");
      if (l.getAttribute("href") === "#" + current) l.classList.add("active");
    });
  });

  // ---- SMOOTH SCROLL NAV ----
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        if (menu) menu.classList.remove("open");
      }
    });
  });

  // ---- TYPED TEXT ----
  const typedOutput = document.querySelector(".typed-output");
  const strings = ["Game Developer", "Unity Specialist", "C# Programmer", "Multiplayer Expert"];
  let si = 0, ci = 0, deleting = false;
  function typeLoop() {
    const current = strings[si];
    if (!deleting) {
      typedOutput.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
      typedOutput.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; si = (si + 1) % strings.length; }
    }
    setTimeout(typeLoop, deleting ? 60 : 100);
  }
  if (typedOutput) typeLoop();

  // ---- COUNTER ANIMATION ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"));
    let count = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(interval);
    }, 40);
  }

  // ---- SKILL BARS + COUNTERS (IntersectionObserver) ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // skill bars
        entry.target.querySelectorAll(".skill-bar").forEach(bar => {
          bar.style.width = bar.getAttribute("data-width") + "%";
        });
        // counters
        entry.target.querySelectorAll(".stat-num").forEach(animateCounter);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll("#skill, #home").forEach(s => {
    if (s) observer.observe(s);
  });

  // Also observe skill section separately
  const skillSection = document.getElementById("skill");
  if (skillSection) observer.observe(skillSection);
  const homeSection = document.getElementById("home");
  if (homeSection) observer.observe(homeSection);

  // ---- PORTFOLIO FILTER ----
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      portfolioItems.forEach(item => {
        if (filter === "*" || item.classList.contains(filter.replace(".", ""))) {
          item.style.display = "block";
          item.style.animation = "fadeIn 0.4s ease";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // ---- OWL CAROUSEL (testimonials) ----
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof jQuery !== "undefined" && jQuery.fn.owlCarousel) {
      jQuery(".testimonial-carousel").owlCarousel({
        items: 1, loop: true, margin: 20, dots: true,
        autoplay: true, autoplayTimeout: 5000, smartSpeed: 800
      });
    }
  });

  // ---- LIGHTBOX CONFIG ----
  if (typeof lightbox !== "undefined") {
    lightbox.option({ resizeDuration: 300, wrapAround: true, albumLabel: "Image %1 of %2" });
  }

})();

  // ---- SCROLL REVEAL ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".section, .about-grid, .timeline-item, .skill-card, .portfolio-card, .contact-info, .contact-form-wrap").forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // ---- SMOOTH SCROLL FOR BUTTONS ----
  document.querySelectorAll(".btn-scroll").forEach(btn => {
    btn.addEventListener("click", e => {
      const href = btn.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
