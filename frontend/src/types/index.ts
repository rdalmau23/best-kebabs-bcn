export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Kebab {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  tags: KebabTag[];
  avgRating: number;
  ratingsCount: number;
}

export type KebabTag = 'halal' | '24h' | 'pollo' | 'ternera';

export interface Rating {
  _id: string;
  userId: string;
  kebabId: string;
  score: number;
  comment?: string;
  createdAt: string;
  user?: {
    username: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface CreateRatingData {
  kebabId: string;
  score: number;
  comment?: string;
}
