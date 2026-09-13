import { postsByYear } from "@/utils/groupPosts";
import { markdownResponse } from "@/utils/markdownResponse";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import getSortedPosts from "@/utils/getSortedPosts";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  let markdownContent = `# Archives\n\n`;
  markdownContent += `Total posts: ${sortedPosts.length}\n\n`;

  markdownContent += `## Posts by Year\n\n`;

  for (const [year, yearPosts] of postsByYear(sortedPosts)) {
    const count = yearPosts.length;
    markdownContent += `- [${year}](/posts.md#${year}) (${count} post${count !== 1 ? "s" : ""})\n`;
  }

  markdownContent += `\n---\n\n[Back to Home](/index.md) | [All Posts](/posts.md)`;

  return markdownResponse(markdownContent);
};
