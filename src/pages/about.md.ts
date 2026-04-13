import type { APIRoute } from "astro";
import { profileContent } from "@/data/profile";

export const GET: APIRoute = async () => {
  try {
    const content = profileContent.en;
    const sections = content.aboutSections
      .map(
        (section) => `## ${section.title}\n\n${section.items.map((item) => `- ${item}`).join("\n")}`
      )
      .join("\n\n");
    const contacts = content.contacts
      .map((contact) => `- ${contact.label}: ${contact.text} (${contact.href})`)
      .join("\n");
    const markdownContent = `# ${content.aboutTitle}\n\n${content.aboutIntro.join("\n\n")}\n\n${sections}\n\n## ${content.contactTitle}\n\n${contacts}`;

    return new Response(markdownContent, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
