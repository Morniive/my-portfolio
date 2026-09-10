const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  const light = root.dataset.theme === "light";
  if (light) {
    delete root.dataset.theme;
    themeBtn.textContent = "◐";
  } else {
    root.dataset.theme = "light";
    themeBtn.textContent = "◑";
  }
});

// Sound Effects (Web Audio API Synthesizer - Cyber SFX)
let sfxEnabled = true;
const sfxBtn = document.getElementById("sfxBtn");

sfxBtn.addEventListener("click", () => {
  sfxEnabled = !sfxEnabled;
  sfxBtn.textContent = sfxEnabled ? "🔊" : "🔇";
});

function playClickSound() {
  if (!sfxEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
}

document.querySelectorAll(".sound-btn").forEach(el => {
  el.addEventListener("click", () => playClickSound());
});

// Subtle 3D cursor tilt for cards and terminal
document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    const terminal = card.querySelector(".terminal");
    if (terminal) {
      terminal.style.transform = `rotateY(${x * -14 - 8}deg) rotateX(${y * 9 + 5}deg)`;
    } else {
      card.style.transform = `translateY(-10px) rotateY(${x * 15}deg) rotateX(${y * -15}deg)`;
    }
  });
  card.addEventListener("mouseleave", () => {
    const terminal = card.querySelector(".terminal");
    if (terminal) {
      terminal.style.transform = "rotateY(-8deg) rotateX(5deg)";
    } else {
      card.style.transform = "none";
    }
  });
});

// Lightbox Modal Functionality for Certificates
const modal = document.getElementById("lightboxModal");
const modalImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".lightbox-close");

document.querySelectorAll(".clickable-img").forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Active navigation
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, {rootMargin: "-35% 0px -55% 0px"});
sections.forEach(s => navObserver.observe(s));

// Back to top
document.getElementById("topBtn").addEventListener("click", () =>
  window.scrollTo({top: 0, behavior: "smooth"})
);

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Keyboard shortcut: press G to return home
document.addEventListener("keydown", e => {
  if (e.key.toLowerCase() === "g" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
    location.hash = "home";
  }
});