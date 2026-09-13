import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

export function groupPosts(posts: Post[], key: (post: Post) => number) {
  return Object.fromEntries(Map.groupBy(posts, key));
}

export function postsByYear(posts: Post[]) {
  return Object.entries(groupPosts(posts, (post) => post.data.pubDatetime.getFullYear())).sort(
    ([a], [b]) => Number(b) - Number(a),
  );
}
