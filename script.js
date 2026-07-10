const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-site-nav]");

const setMenuOpen = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  nav?.toggleAttribute("data-open", open);
};

menuButton?.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...(nav?.querySelectorAll("a") ?? [])];
const indexCurrent = document.querySelector("[data-index-current]");

const setActiveSection = (section) => {
  const sectionId = section.id;
  document.body.dataset.activeSection = sectionId;
  document.body.style.setProperty(
    "--index-progress",
    `${((sections.indexOf(section) + 1) / sections.length) * 100}%`,
  );
  if (indexCurrent) indexCurrent.textContent = section.dataset.index;

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target);
    },
    { rootMargin: "-32% 0px -48%", threshold: [0, 0.15, 0.45] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll("[data-map-node]").forEach((node) => {
  node.addEventListener("focus", () => node.setAttribute("data-active", ""));
  node.addEventListener("blur", () => node.removeAttribute("data-active"));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = button.querySelector("[data-copy-status]");

    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = "已复制";
      window.setTimeout(() => {
        if (status) status.textContent = "点击复制";
      }, 1800);
    } catch {
      if (status) status.textContent = value;
    }
  });
});
