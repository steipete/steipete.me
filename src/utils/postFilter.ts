import type { CollectionEntry } from "astro:content";
import { isListed, isPublished } from "./postVisibility.ts";

export const publishedPostFilter = ({ data }: CollectionEntry<"blog">) =>
  isPublished(data, { preview: import.meta.env.DEV });

const postFilter = ({ data }: CollectionEntry<"blog">) =>
  isListed(data, { preview: import.meta.env.DEV });

export default postFilter;
