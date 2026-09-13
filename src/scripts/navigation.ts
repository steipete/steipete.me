export function initializeNavigation(document: Document, signal: AbortSignal) {
  const button = document.querySelector<HTMLButtonElement>("#menu-btn");
  const items = document.querySelector("#menu-items");
  const menuIcon = document.querySelector("#menu-icon");
  const closeIcon = document.querySelector("#close-icon");
  if (!button || !items || !menuIcon || !closeIcon) return;
  const setOpen = (open: boolean) => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close Menu" : "Open Menu");
    items.classList.toggle("hidden", !open);
    menuIcon.classList.toggle("hidden", open);
    closeIcon.classList.toggle("hidden", !open);
  };
  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"), {
    signal,
  });
  document.addEventListener(
    "keydown",
    (event) => {
      if (
        !event.defaultPrevented &&
        event.key === "Escape" &&
        button.getAttribute("aria-expanded") === "true"
      ) {
        setOpen(false);
        button.focus();
      }
    },
    { signal },
  );
}
