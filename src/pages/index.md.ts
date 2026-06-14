import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Sarwan Shafeeq

ICT Engineer and Data Analyst based in Erbil, Iraq.

I use data analytics, data science, and technology to support strategic decisions and innovation.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [Sarwan-09](https://github.com/Sarwan-09)
- LinkedIn: [Sarwan Shafeeq](https://www.linkedin.com/in/sarwan-shafeeq-2a387127b/)
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
