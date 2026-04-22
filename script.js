const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav a");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -50px 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const liftCards = document.querySelectorAll(".lift-card");

if (supportsFinePointer) {
  liftCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = (0.5 - (y / rect.height)) * 6;
      card.style.transform = `perspective(950px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

const magneticButtons = document.querySelectorAll("[data-magnetic]");

if (supportsFinePointer) {
  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

const googleReviewGrid = document.getElementById("googleReviewGrid");

if (googleReviewGrid && !googleReviewGrid.dataset.loopReady) {
  const cards = Array.from(googleReviewGrid.children);
  cards.forEach((card) => {
    googleReviewGrid.appendChild(card.cloneNode(true));
  });
  googleReviewGrid.dataset.loopReady = "true";
}
