import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import getSortedPosts from "@/utils/getSortedPosts";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  let markdownContent = `# All Posts\n\n`;

  // Group posts by year
  const postsByYear = sortedPosts.reduce(
    (acc, post) => {
      const year = post.data.pubDatetime.getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, typeof sortedPosts>
  );

  // Sort years descending
  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  for (const year of years) {
    markdownContent += `## ${year}\n\n`;

    for (const post of postsByYear[Number(year)]) {
      const date = post.data.pubDatetime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      markdownContent += `- ${date}: [${post.data.title}](/posts/${post.id}.md)\n`;
    }

    markdownContent += "\n";
  }

  markdownContent += `---\n\n[Back to Home](/index.md)`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
