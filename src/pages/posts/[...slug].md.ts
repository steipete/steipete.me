import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  // Read the raw markdown content
  const rawContent = post.body;

  // Return the markdown content with proper headers
  return new Response(rawContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
