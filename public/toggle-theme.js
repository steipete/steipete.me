(() => {
  const owner = Symbol.for("steipete.theme");
  if (window[owner]) {
    window[owner]();
    return;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const day = 24 * 60 * 60 * 1000;
  let buttonScope;
  const accessStorage = (operation) => {
    try {
      return operation(localStorage);
    } catch {
      /* Keep the theme usable when browser storage is blocked. */
    }
  };
  const readSaved = () =>
    accessStorage((storage) => {
      const theme = storage.getItem("theme");
      const timestamp = Number(storage.getItem("themeSetTimestamp"));
      if ((theme === "dark" || theme === "light") && Number.isFinite(timestamp) && timestamp > 0) {
        return { theme, timestamp };
      }
    });
  let manual = readSaved();

  const preferred = () => {
    if (manual && Date.now() - manual.timestamp < day) return manual.theme;
    if (manual) {
      manual = undefined;
      accessStorage((storage) => {
        storage.removeItem("theme");
        storage.removeItem("themeSetTimestamp");
      });
    }
    return media.matches ? "dark" : "light";
  };
  const reflect = (target = document) => {
    const theme = preferred();
    target.documentElement.setAttribute("data-theme", theme);
    target.querySelector("#theme-btn")?.setAttribute("aria-label", theme);
    if (target.body) target.body.style.colorScheme = theme;
  };
  window[owner] = reflect;
  reflect();

  const bindButton = () => {
    buttonScope?.abort();
    buttonScope = new AbortController();
    reflect();
    document.querySelector("#theme-btn")?.addEventListener(
      "click",
      () => {
        manual = { theme: preferred() === "light" ? "dark" : "light", timestamp: Date.now() };
        accessStorage((storage) => {
          storage.setItem("theme", manual.theme);
          storage.setItem("themeSetTimestamp", String(manual.timestamp));
        });
        const update = () => reflect();
        if (document.startViewTransition) document.startViewTransition(update);
        else update();
      },
      { signal: buttonScope.signal },
    );
  };
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bindButton, { once: true });
  else bindButton();
  document.addEventListener("astro:before-swap", (event) => {
    buttonScope?.abort();
    reflect(event.newDocument);
  });
  document.addEventListener("astro:after-swap", bindButton);
  media.addEventListener("change", () => reflect());
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === "theme" || event.key === "themeSetTimestamp") {
      manual = readSaved();
      reflect();
    }
  });
})();
