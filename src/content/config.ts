import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Handle both date and pubDate fields for backward compatibility
    pubDate: z.coerce.date().optional(),
    date: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    image: z.string().optional(),
    source: z.string().optional(),
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    layout: z.string().optional(),
  }).transform(data => {
    // Convert date to pubDate if pubDate is missing but date exists
    if (!data.pubDate && data.date) {
      data.pubDate = data.date;
    }

    // Add a default description if missing
    if (!data.description) {
      data.description = `${data.title}`;
    }

    // Convert string tags to array
    if (typeof data.tags === 'string') {
      data.tags = [data.tags];
    }

    return data;
  }),
});

export const collections = {
  'blog': blog,
};