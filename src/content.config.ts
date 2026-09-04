import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  imageField,
  draftField,
  statusField,
  stringListField,
  looseDateField,
} from './lib/blog-schema';

/**
 * Payload-synced posts: title is the only hard requirement. Everything else
 * has a fallback, because a Zod rejection here drops the post from the
 * collection entirely — the article simply never comes online.
 */
const blogSchema = z
  .object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    pubDate: looseDateField,
    date: looseDateField,
    updatedDate: looseDateField,
    author: z.string().optional(),
    categories: stringListField,
    tags: stringListField,
    featuredImage: imageField,
    featuredImageAlt: z.string().optional(),
    heroImage: imageField,
    heroImageAlt: z.string().optional(),
    image: imageField,
    ogImage: imageField,
    extra: z
      .object({ featuredImage: imageField, heroImage: imageField, image: imageField })
      .passthrough()
      .optional(),
    draft: draftField,
    _status: statusField,
    publishStatus: statusField,
  })
  .passthrough()
  .transform((d) => {
    const pubDate = d.pubDate ?? d.date ?? new Date(0);
    const description = d.description ?? d.excerpt ?? d.metaDescription ?? '';
    return {
      ...d,
      pubDate,
      date: d.date ?? pubDate,
      description,
      metaDescription: d.metaDescription ?? description,
      metaTitle: d.metaTitle ?? d.title,
    };
  });

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  schema: blogSchema,
});

export const collections = { blog };
