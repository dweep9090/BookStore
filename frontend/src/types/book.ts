export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  description: string;
  aiDescription: string | null;
  coverUrl: string | null;
  price: number;
  stock: number;
  category: string;
  genre: string;
  averageRating: number;
  reviewCount: number;
  aiSummary: string | null;
  summaryUpdatedAt: string | null;
  createdAt: string;
  updatedAt: string;

  reviews?: Review[];
}

export interface Review {
  id: string;

  rating: number;

  content: string;

  createdAt: string;

  user?: {
    id: string;
    name: string;
  };
}

export interface Recommendation {
  title: string;
  author: string;
  reason: string;
}