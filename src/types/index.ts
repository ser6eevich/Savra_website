export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  orderType?: 'catalog' | 'constructor';
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
  avatar?: string;
  role: 'client' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderType: 'catalog' | 'constructor'; // Различие для CRM
  createdAt: Date;
  updatedAt: Date;
  promoCode?: string;
  discount?: number;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  isActive: boolean;
  createdAt: Date;
  usageCount: number;
  maxUsage?: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
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
  | 'profile'
  | 'constructor'
  | 'admin'
  | '404';