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
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = Number(entry.target.dataset.count);
      let current = 0;
      const step = () => {
        current += 1;
        entry.target.textContent = String(current);
        if (current < target) window.setTimeout(step, 75);
      };

      step();
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const flipButton = document.querySelector(".flip-control");

if (flipButton) {
  flipButton.addEventListener("click", () => {
    flipButton.classList.remove("is-flipping");
    window.requestAnimationFrame(() => {
      flipButton.classList.add("is-flipping");
    });
  });
}

document.querySelectorAll(".travel-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-7px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".info-hotspot").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = button.closest(".travel-card");
    const isOpen = card.classList.contains("info-open");

    document.querySelectorAll(".travel-card.info-open").forEach((openCard) => {
      openCard.classList.remove("info-open");
    });

    if (!isOpen) {
      card.classList.add("info-open");
    }
  });
});

document.querySelectorAll(".travel-card img").forEach((image) => {
  image.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = image.closest(".travel-card");
    const isOpen = card.classList.contains("info-open");

    document.querySelectorAll(".travel-card.info-open").forEach((openCard) => {
      openCard.classList.remove("info-open");
    });

    if (!isOpen) {
      card.classList.add("info-open");
    }
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".travel-card.info-open").forEach((card) => {
    card.classList.remove("info-open");
  });
});

const tiltItems = document.querySelectorAll(
  ".button, nav a, .brand, h1, h2, h3, .mode-token, .price, .glass-strip strong, .strip-prices span"
);

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.setProperty("--tilt-x", `${x * 7}deg`);
    item.style.setProperty("--tilt-y", `${y * -5}deg`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.setProperty("--tilt-x", "0deg");
    item.style.setProperty("--tilt-y", "0deg");
  });
});

let scrollTicking = false;

const updateScrollTilt = () => {
  const viewportMiddle = window.innerHeight / 2;

  tiltItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemMiddle = rect.top + rect.height / 2;
    const distance = (itemMiddle - viewportMiddle) / viewportMiddle;
    const clamped = Math.max(-1, Math.min(1, distance));
    item.style.setProperty("--scroll-lift", `${clamped * -2}px`);
  });

  scrollTicking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateScrollTilt);
      scrollTicking = true;
    }
  },
  { passive: true }
);

updateScrollTilt();
