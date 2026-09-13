export function initializePost(document: Document, signal: AbortSignal) {
  const article = document.querySelector<HTMLElement>("#article");
  if (!article) return;
  const view = document.defaultView as Window & typeof globalThis;
  const timers = new Set<number>();
  signal.addEventListener(
    "abort",
    () => {
      for (const timer of timers) view.clearTimeout(timer);
    },
    { once: true },
  );

  const progress = document.querySelector<HTMLElement>("#reading-progress");
  if (progress) {
    const update = () => {
      const root = document.documentElement;
      const height = root.scrollHeight - root.clientHeight;
      const percent = height > 0 ? Math.max(0, Math.min(100, (root.scrollTop / height) * 100)) : 0;
      progress.style.width = `${percent}%`;
    };
    document.addEventListener("scroll", update, { passive: true, signal });
    view.addEventListener("resize", update, { signal });
    update();
  }

  for (const heading of article.querySelectorAll<HTMLElement>(
    "h2[id], h3[id], h4[id], h5[id], h6[id]",
  )) {
    if (!heading.id || heading.querySelector(".heading-link")) continue;
    heading.classList.add("group");
    const link = document.createElement("a");
    link.className = "heading-link ml-2 opacity-0 group-hover:opacity-100 focus:opacity-100";
    link.href = `#${heading.id}`;
    link.setAttribute("aria-label", `Link to ${heading.textContent?.trim()}`);
    link.textContent = "#";
    heading.append(link);
  }

  for (const block of article.querySelectorAll<HTMLPreElement>("pre")) {
    let wrapper = block.parentElement!;
    if (!wrapper.hasAttribute("data-code-block")) {
      wrapper = document.createElement("div");
      wrapper.dataset.codeBlock = "";
      wrapper.style.position = "relative";
      block.before(wrapper);
      wrapper.append(block);
    }
    let button = wrapper.querySelector<HTMLButtonElement>(":scope > .copy-code");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className =
        "copy-code absolute right-3 -top-3 rounded bg-muted px-2 py-1 text-xs leading-4 text-foreground font-medium";
      button.setAttribute("aria-live", "polite");
      wrapper.append(button);
    }
    const copyButton = button;
    copyButton.disabled = false;
    copyButton.textContent = "Copy";
    copyButton.setAttribute("aria-label", "Copy code");
    block.tabIndex = 0;
    let resetTimer: number | undefined;
    const feedback = (label: string) => {
      if (signal.aborted) return;
      copyButton.textContent = label;
      copyButton.setAttribute("aria-label", label);
      if (resetTimer !== undefined) {
        view.clearTimeout(resetTimer);
        timers.delete(resetTimer);
      }
      resetTimer = view.setTimeout(() => {
        copyButton.textContent = "Copy";
        copyButton.setAttribute("aria-label", "Copy code");
        timers.delete(resetTimer!);
      }, 700);
      timers.add(resetTimer);
    };
    copyButton.addEventListener(
      "click",
      async () => {
        copyButton.disabled = true;
        try {
          const source = block.querySelector("code") ?? block;
          await view.navigator.clipboard.writeText(source.textContent ?? "");
          feedback("Copied");
        } catch {
          feedback("Copy failed");
        } finally {
          if (!signal.aborted) copyButton.disabled = false;
        }
      },
      { signal },
    );
  }

  for (const image of article.querySelectorAll<HTMLImageElement>("img:not([loading])"))
    image.loading = "lazy";
  document
    .querySelector("#back-to-top")
    ?.addEventListener("click", () => view.scrollTo({ top: 0 }), { signal });
  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
      )
        return;
      const target = event.target;
      if (
        target instanceof view.Element &&
        target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")
      )
        return;
      if (event.key.startsWith("Arrow") && target instanceof view.Element && target.closest("pre"))
        return;
      const selector =
        event.key === "j" || event.key === "ArrowRight"
          ? "#next-post-link"
          : event.key === "k" || event.key === "ArrowLeft"
            ? "#prev-post-link"
            : undefined;
      const link = selector && document.querySelector<HTMLAnchorElement>(selector);
      if (link) {
        event.preventDefault();
        link.click();
      }
    },
    { signal },
  );
}
