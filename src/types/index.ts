import type { User as SupabaseUser, Product as SupabaseProduct, Order as SupabaseOrder } from './database'

// Расширяем типы из Supabase для совместимости с существующим кодом
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  orderType?: 'catalog' | 'constructor';
}

// Адаптируем Product из Supabase
export interface Product extends Omit<SupabaseProduct, 'image_url' | 'video_url' | 'sizes'> {
  image: string; // Маппим image_url -> image для совместимости
  video?: string; // Маппим video_url -> video
  sizes?: string[]; // Уже правильный тип
  collection?: string;
  article?: string;
  material?: string;
  detailedDescription?: string;
  type?: 'classic' | 'textured' | 'mens' | 'classic_mens' | 'textured_mens';
}

// Адаптируем User из Supabase
export interface User extends Omit<SupabaseUser, 'name' | 'avatar_url' | 'created_at'> {
  firstName: string; // Будем парсить из name
  lastName: string; // Будем парсить из name
  avatar?: string; // Маппим avatar_url -> avatar
  dateOfBirth?: string;
  isAdmin?: boolean;
  createdAt: Date; // Конвертируем из string
  updatedAt: Date;
}

// Адаптируем Order из Supabase
export interface Order extends Omit<SupabaseOrder, 'user_id' | 'product_id' | 'created_at'> {
  userId: string; // Маппим user_id -> userId
  productId: string; // Маппим product_id -> productId
  items: CartItem[]; // Дополнительное поле для корзины
  total: number; // Дополнительное поле
  orderType: 'catalog' | 'constructor';
  createdAt: Date; // Конвертируем из string
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