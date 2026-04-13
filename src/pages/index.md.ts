import type { APIRoute } from "astro";
import { SITE } from "@/config";

export const GET: APIRoute = async () => {
  const markdownContent = `# ${SITE.title}

${SITE.desc}

## Navigation

- [About](/about.md)

---

This is the markdown version of the homepage with a short profile summary and a link to the About page.`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
