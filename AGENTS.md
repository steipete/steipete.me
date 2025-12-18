# AGENTS.md
## New Blog Post Workflow
- If user says “new blog post” without topic/title: ask for topic/title first.
- Pick branch name: short slug from topic/title.
- Scaffold file: `src/content/blog/<year>/<slug>.md`.
- Frontmatter: only set `title` from user input; keep required placeholders minimal (`description: "TBD"`, `draft: true`, `pubDatetime: <today>`).
- No body content; no invented outline.
- Open editor: `code <new-post-path>`.
