import type { CollectionEntry } from "astro:content";
import { SITE } from "../config.ts";
import { SOCIALS } from "../constants.ts";

type ArticleData = Pick<
  CollectionEntry<"blog">["data"],
  "title" | "description" | "author" | "pubDatetime" | "modDatetime" | "tags"
> & {
  url: string;
  ogImage?: string;
  wordCount: number;
  readingTimeMinutes: number;
};

export type StructuredDataProps =
  | { type: "BlogPosting"; data: ArticleData }
  | { type: "Person" | "WebSite"; data: Record<string, never> };

export function structuredDataJson({ type, data }: StructuredDataProps): string {
  const site = new URL(SITE.website).origin;
  const image = new URL(SITE.ogImage, SITE.website).href;
  const person = { "@type": "Person", name: SITE.author };
  const shared = { "@context": "https://schema.org", "@type": type };
  let schema;
  if (type === "BlogPosting") {
    schema = {
      ...shared,
      headline: data.title,
      description: data.description,
      author: {
        "@type": "Person",
        name: data.author,
        ...(data.author === SITE.author && { url: SITE.profile }),
      },
      datePublished: data.pubDatetime.toISOString(),
      dateModified: (data.modDatetime ?? data.pubDatetime).toISOString(),
      publisher: { ...person, logo: { "@type": "ImageObject", url: image } },
      mainEntityOfPage: { "@type": "WebPage", "@id": data.url },
      image: data.ogImage || image,
      articleSection: data.tags[0] || "Technology",
      keywords: data.tags.join(", "),
      wordCount: data.wordCount,
      timeRequired: `PT${data.readingTimeMinutes}M`,
    };
  } else if (type === "Person") {
    schema = {
      ...shared,
      ...person,
      url: site,
      image: image,
      sameAs: SOCIALS.filter((social) => social.active && social.href.startsWith("https:")).map(
        (social) => social.href,
      ),
      jobTitle: "Software Engineer",
      description: SITE.desc,
    };
  } else {
    schema = {
      ...shared,
      name: SITE.title,
      url: site,
      description: SITE.desc,
      author: person,
      potentialAction: {
        "@type": "SearchAction",
        target: `${site}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };
  }
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
