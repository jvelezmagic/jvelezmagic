import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const log = defineCollection({
  loader: file('src/data/log.yaml'),
  schema: z.object({
    date: z.coerce.date(),
    lane: z.enum(['engineering', 'science', 'teaching']),
    kind: z.enum(['role', 'paper', 'course', 'talk', 'merge']),
    head: z.boolean().default(false),
    title: z.string(),
    org: z.string().optional(),
    award: z.string().optional(),
    blurb: z.string().optional(),
    tags: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    diff: z.array(z.string()).default([]),
  }),
});

const chapters = defineCollection({
  loader: file('src/data/chapters.yaml'),
  schema: z.object({
    from: z.coerce.date(),
    command: z.string(),
    title: z.string(),
    story: z.string(),
  }),
});

const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z.object({
    title: z.string(),
    repo: z.string().optional(),
    kind: z.enum(['open-source', 'hackathon', 'research']),
    award: z.string().optional(),
    year: z.number(),
    language: z.string().optional(),
    stars: z.number().default(0),
    blurb: z.string(),
    url: z.url(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { log, chapters, projects, blog };
