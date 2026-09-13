import { getPath } from "@/utils/getPath";
import { getPostAliases } from "@/utils/postAliases";
import { publishedPostFilter } from "@/utils/postFilter";
import { markdownResponse } from "@/utils/markdownResponse";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const byPath = new Map(posts.map((post) => [getPath(post.id, post.filePath), post]));
  return [
    ...posts.filter(publishedPostFilter).map((post) => ({
      params: { slug: post.id },
      props: { post },
    })),
    ...getPostAliases(posts, { preview: import.meta.env.DEV }).map(({ slug, destination }) => ({
      params: { slug },
      props: { post: byPath.get(destination)! },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  const rawContent = post.body;

  return markdownResponse(rawContent);
};
