import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Sarwan Shafeeq

Personal website of Sarwan Shafeeq.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- RSS: [/rss.xml](/rss.xml)

---

*This is the markdown-only version of the site.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
