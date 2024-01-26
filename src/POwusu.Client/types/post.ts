export interface PostItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  publishedAt: string;
  deleted: boolean;
  readingDuration: number;
}

export interface PostsPage {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nextPage: number;
  previousPage: number;
  items: PostItem[];
}
