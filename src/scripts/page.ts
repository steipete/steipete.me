import { initializeNavigation } from "./navigation.ts";
import { initializePost } from "./post.ts";
import { initializeSearch } from "./search.ts";

const lifecycle = Symbol.for("steipete.pageLifecycle");
type PageDocument = Document & { [lifecycle]?: () => void };

export function installPageLifecycle(document: Document) {
  const page = document as PageDocument;
  page[lifecycle]?.();
  const view = document.defaultView as Window & typeof globalThis;
  let scope: AbortController | undefined;
  const dispose = () => scope?.abort();
  const initialize = () => {
    dispose();
    scope = new view.AbortController();
    initializeNavigation(document, scope.signal);
    initializePost(document, scope.signal);
    const search = document.querySelector<HTMLElement>("#pagefind-search");
    if (search) void initializeSearch(search, scope.signal);
  };
  document.addEventListener("astro:before-swap", dispose);
  document.addEventListener("astro:page-load", initialize);
  const cleanup = () => {
    dispose();
    document.removeEventListener("astro:before-swap", dispose);
    document.removeEventListener("astro:page-load", initialize);
    if (page[lifecycle] === cleanup) delete page[lifecycle];
  };
  page[lifecycle] = cleanup;
  initialize();
  return cleanup;
}
