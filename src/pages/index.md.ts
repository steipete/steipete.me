import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Jasontopia

I'm Jasontopia, an AI solopreneur building singular leverage with AI - sharing model shifts, tools, and monetization playbooks.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [RSS Feed](/rss.xml)

## Links

- X: [@jasontopia](https://x.com/jasontopia)
- GitHub: [@jasontopia](https://github.com/jasontopia)
- LinkedIn: [Jasontopia](https://www.linkedin.com/in/jasontopia/)

---

*This is the markdown version of jasontopia.me. Visit [jasontopia.me](https://jasontopia.me) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
