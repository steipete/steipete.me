import type { PagefindUI } from "@pagefind/default-ui";

type LoadSearch = () => Promise<typeof PagefindUI>;

export async function initializeSearch(
  root: HTMLElement,
  signal: AbortSignal,
  load: LoadSearch = async () => (await import("@pagefind/default-ui")).PagefindUI,
) {
  try {
    const Search = await load();
    if (signal.aborted || !root.isConnected) return;
    const document = root.ownerDocument;
    const view = document.defaultView!;
    const search = new Search({
      element: root,
      showSubResults: true,
      showImages: false,
      translations: { placeholder: "Search posts, e.g. 'Swift concurrency'" },
    });
    signal.addEventListener("abort", () => search.destroy(), { once: true });
    const initialQuery = new URL(view.location.href).searchParams.get("q") ?? "";
    search.triggerSearch(initialQuery);

    const updateUrl = (term: string) => {
      if (signal.aborted || !root.isConnected) return;
      const url = new URL(view.location.href);
      if (url.pathname.replace(/\/+$/, "") !== "/search") return;
      if (term.trim()) url.searchParams.set("q", term);
      else url.searchParams.delete("q");
      view.history.replaceState(view.history.state, "", url.pathname + url.search + url.hash);
      try {
        view.sessionStorage.setItem("backUrl", url.pathname + url.search);
      } catch {
        // Search remains usable when browser storage is unavailable.
      }
    };
    updateUrl(initialQuery);
    const input = root.querySelector<HTMLInputElement>(".pagefind-ui__search-input");
    input?.focus();
    input?.addEventListener("input", () => updateUrl(input.value), { signal });
    root
      .querySelector(".pagefind-ui__search-clear")
      ?.addEventListener("click", () => updateUrl(""), { signal });
  } catch {
    if (!signal.aborted && root.isConnected)
      root.textContent = "Search could not load. Please reload the page.";
  }
}
