declare module "remark-collapse" {
  interface CollapseOptions {
    test?: string;
    summary?: string;
  }

  const remarkCollapse: (options?: CollapseOptions) => unknown;
  export default remarkCollapse;
}
