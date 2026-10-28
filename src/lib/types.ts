export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  company: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export interface NewsFilters {
  q?: string;
  category?: string;
  date?: string;
  page?: number;
  limit?: number;
}

export interface NewsResult {
  articles: NewsArticle[];
  total: number;
  page: number;
  pages: number;
}
