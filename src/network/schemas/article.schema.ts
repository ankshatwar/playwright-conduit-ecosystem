import { z } from 'zod';

// Strict validation definition using modern Zod v4 top-level formatters
export const ArticleResponseSchema = z.object({
  article: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    body: z.string(),
    tagList: z.array(z.string()),

    createdAt: z.iso.datetime(), 
    updatedAt: z.iso.datetime(),
    
    favorited: z.boolean(),
    favoritesCount: z.number(),
    author: z.object({
      username: z.string(),
      bio: z.string().nullable(),
      
      image: z.url().nullable()
    })
  })
});

// Extract TypeScript types directly from the Zod Schema definition 
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;