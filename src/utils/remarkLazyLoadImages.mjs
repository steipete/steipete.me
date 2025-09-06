import { visit } from "unist-util-visit";

export function remarkLazyLoadImages() {
  return (tree) => {
    visit(tree, "image", (node) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.loading = "lazy";
    });
  };
}
