import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Eugen Köpplin

Personal blog by Eugen Köpplin.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [@ekoepplin](https://github.com/ekoepplin)
- LinkedIn: [ekoepplin](https://www.linkedin.com/in/ekoepplin/)
- Email: info@datadidact.com

---

*This is the markdown-only version of datadidact.com. Visit [datadidact.com](https://datadidact.com) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
