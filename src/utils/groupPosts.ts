import type { CollectionEntry } from "astro:content";
import { getPostDate } from "./postDate.ts";

type Post = CollectionEntry<"blog">;

function groupPosts(posts: Post[], key: (post: Post) => number) {
  return [...Map.groupBy(posts, key)].sort(([a], [b]) => b - a);
}

export function postsByYear(posts: Post[]) {
  return groupPosts(posts, (post) => getPostDate(post.data.pubDatetime, post.data.timezone).year());
}

export function postsByMonth(posts: Post[]) {
  return groupPosts(
    posts,
    (post) => getPostDate(post.data.pubDatetime, post.data.timezone).month() + 1,
  );
}
