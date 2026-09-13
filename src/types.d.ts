declare module "remark-collapse" {
  interface CollapseOptions {
    test: string;
    summary?: string | ((heading: string) => string);
  }

  const remarkCollapse: import("@astrojs/markdown-remark").RemarkPlugin<[CollapseOptions]>;
  export default remarkCollapse;
}
