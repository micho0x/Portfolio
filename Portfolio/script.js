/**
 * 0xMicho Portfolio — Interactive Logic
 * Handles: Theme (persisted in localStorage), Mobile Nav, Cursor Glow, 3D Tilt
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ─── Theme Management ─────────────────────────────────────────── */
  const themeBtn = document.getElementById("theme-toggle");
  const htmlEl   = document.documentElement;

  // Reinforce saved theme (also done inline in <head> to prevent FOUC)
  const currentTheme = localStorage.getItem("theme") || "dark";
  htmlEl.setAttribute("data-theme", currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme");
      const next    = current === "dark" ? "light" : "dark";
      htmlEl.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);   // <-- persist across all pages
    });
  }

  /* ─── Navbar Scroll Blur ───────────────────────────────────────── */
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ─── Mobile Navigation Toggle ────────────────────────────────── */
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks     = document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {

    const getIcon = () => mobileToggle.querySelector("i");

    const openMenu = () => {
      navLinks.classList.add("active");
      getIcon().classList.replace("ph-list", "ph-x");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      navLinks.classList.remove("active");
      getIcon().classList.replace("ph-x", "ph-list");
      document.body.style.overflow = "";
    };

    mobileToggle.addEventListener("click", () =>
      navLinks.classList.contains("active") ? closeMenu() : openMenu()
    );

    // Close when any real link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href") || "";
        if (href !== "#") closeMenu();
      });
    });

    // Mobile dropdown accordion
    document.querySelectorAll(".dropdown > a, .dropdown-submenu > a").forEach(toggle => {
      toggle.addEventListener("click", e => {
        if (window.innerWidth > 768) return;
        const href = toggle.getAttribute("href") || "";
        if (!href.startsWith("#") && href !== "") return;
        e.preventDefault();
        toggle.closest(".dropdown, .dropdown-submenu").classList.toggle("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", e => {
      if (navbar && !navbar.contains(e.target) && navLinks.classList.contains("active")) closeMenu();
    });
  }

  /* ─── Cursor Glow (pointer devices only) ──────────────────────── */
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;

    document.addEventListener("mousemove", e => {
      tx = e.clientX;
      ty = e.clientY;
      cursorGlow.style.opacity = "1";
    });
    document.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursorGlow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
  } else if (cursorGlow) {
    cursorGlow.style.display = "none";
  }

  /* ─── 3D Tilt Effect (pointer devices only) ────────────────────── */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt-card").forEach(card => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.12s ease-out, box-shadow 0.4s ease";
      });
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const x  = (e.clientX - r.left)  / r.width;
        const y  = (e.clientY - r.top)   / r.height;
        const ry =  (x - 0.5) * 16;
        const rx = -(y - 0.5) * 16;
        card.style.transform  = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        card.style.transition = "none";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease";
        card.style.transform  = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      });
    });
  }

  /* ─── Discord Toast ────────────────────────────────────────────── */
  const discordBtn   = document.getElementById("discord-btn");
  const discordToast = document.getElementById("discord-toast");
  const toastClose   = document.getElementById("discord-toast-close");

  if (discordBtn && discordToast) {
    let toastTimer = null;

    const showToast = () => {
      discordToast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(dismissToast, 4000);
    };

    const dismissToast = () => {
      discordToast.classList.remove("show");
    };

    discordBtn.addEventListener("click", showToast);
    if (toastClose) toastClose.addEventListener("click", dismissToast);
  }

});
