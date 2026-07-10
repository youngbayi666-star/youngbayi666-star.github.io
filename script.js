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

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = button.querySelector("[data-copy-status]");

    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = "已复制";
    } catch {
      if (status) status.textContent = value;
    }
  });
});
