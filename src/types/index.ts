export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  collection?: string;
  article?: string;
  material?: string;
  detailedDescription?: string;
  sizes?: string[];
  type?: 'classic' | 'textured' | 'mens' | 'classic_mens' | 'textured_mens';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationProps {
  onNavigate: (page: string, productId?: string) => void;
}

export interface PageProps extends NavigationProps {
  // Common props for all pages
}

export type PageType = 
  | 'home' 
  | 'catalog' 
  | 'product' 
  | 'about' 
  | 'cart' 
  | 'favorites' 
  | 'register' 
  | '404';