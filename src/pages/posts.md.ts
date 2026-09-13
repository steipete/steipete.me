import { postsByYear } from "@/utils/groupPosts";
import { markdownResponse } from "@/utils/markdownResponse";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import getSortedPosts from "@/utils/getSortedPosts";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  let markdownContent = `# All Posts\n\n`;

  for (const [year, yearPosts] of postsByYear(sortedPosts)) {
    markdownContent += `## ${year}\n\n`;

    for (const post of yearPosts) {
      const date = post.data.pubDatetime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      markdownContent += `- ${date}: [${post.data.title}](/posts/${post.id}.md)\n`;
    }

    markdownContent += "\n";
  }

  markdownContent += `---\n\n[Back to Home](/index.md)`;

  return markdownResponse(markdownContent);
};
