export interface Author {
  imageUrl: string | null;
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  title: string;
  roles: string[]; // or any other appropriate type
  bio: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  imageId?: string;
  imageUrl?: string;
  createdAt: string;
  publishedAt: string;
  published: boolean;
  deleted: boolean;
  readingDuration: number;
}

export interface PostItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  publishedAt: string;
  published: boolean;
  deleted: boolean;
  readingDuration: number;
  author: Author;
}

export interface PostsPerPage {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  nextPage: number;
  previousPage: number;
  items: PostItem[];
}
