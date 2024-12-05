export const ArticleType = ['venue', 'food', 'equipment', 'extra'] as const;
export type ArticleType = (typeof ArticleType)[number];
