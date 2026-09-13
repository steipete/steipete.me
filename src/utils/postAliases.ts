import type { CollectionEntry } from "astro:content";
import { getPath } from "./getPath.ts";
import { isPublished, type PublicationOptions } from "./postVisibility.ts";

type Post = Pick<CollectionEntry<"blog">, "id" | "filePath" | "data">;

export function getPostAliases(posts: Post[], options?: PublicationOptions) {
  const canonicalPaths = new Set(posts.map((post) => getPath(post.id, post.filePath)));
  const publishedPaths = new Set(
    posts
      .filter((post) => isPublished(post.data, options))
      .map((post) => getPath(post.id, post.filePath)),
  );
  const aliases = new Map<string, string>();
  const ambiguous = new Set<string>();

  for (const post of posts) {
    const destination = getPath(post.id, post.filePath);
    const candidates = [post.id, post.id.split("/").at(-1)!];
    if (!/^\d{4}\//.test(post.id)) {
      candidates.push(
        `${post.data.pubDatetime.getUTCFullYear()}/${post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "")}`,
      );
    }
    for (const slug of candidates) {
      if (canonicalPaths.has(`/posts/${slug}`) || ambiguous.has(slug)) continue;
      if (aliases.has(slug) && aliases.get(slug) !== destination) {
        aliases.delete(slug);
        ambiguous.add(slug);
      } else {
        aliases.set(slug, destination);
      }
    }
  }

  return [...aliases]
    .filter(([, destination]) => publishedPaths.has(destination))
    .map(([slug, destination]) => ({ slug, destination }));
}
