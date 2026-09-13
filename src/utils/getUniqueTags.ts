import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";
import { slugifyStr } from "./slugify";

interface Tag {
  tag: string;
  tagName: string;
}

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const tags = new Map<string, Tag>();
  for (const post of posts.filter(postFilter)) {
    for (const tagName of post.data.tags) {
      const tag = slugifyStr(tagName);
      if (!tags.has(tag)) tags.set(tag, { tag, tagName });
    }
  }
  return [...tags.values()].sort((a, b) => a.tag.localeCompare(b.tag));
};

export default getUniqueTags;
