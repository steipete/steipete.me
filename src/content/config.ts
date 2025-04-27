import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    source: z.enum(['steipete.com', 'petersteinberger.com']).optional(),
  }),
});

export const collections = {
  'blog': blog,
};