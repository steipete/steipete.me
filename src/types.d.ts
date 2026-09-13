declare module "remark-collapse" {
  interface CollapseOptions {
    test: string;
    summary?: string | ((heading: string) => string);
  }

  const remarkCollapse: import("@astrojs/markdown-remark").RemarkPlugin<[CollapseOptions]>;
  export default remarkCollapse;
}

// The Pagefind UI package currently ships no declarations.
declare module "@pagefind/default-ui" {
  interface Options {
    element: string | HTMLElement;
    showSubResults?: boolean;
    showImages?: boolean;
    translations?: Record<string, string>;
  }
  export class PagefindUI {
    constructor(options: Options);
    triggerSearch(term: string): void;
    destroy(): void;
  }
}
