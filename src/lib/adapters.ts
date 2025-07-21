// Адаптеры для преобразования данных между Supabase и приложением
import type { User as SupabaseUser, Product as SupabaseProduct } from '../types/database'
import type { User, Product } from '../types'

export function adaptSupabaseUser(supabaseUser: SupabaseUser): User {
  const [firstName, ...lastNameParts] = supabaseUser.name.split(' ')
  
  return {
    id: supabaseUser.id,
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    email: supabaseUser.email,
    phone: supabaseUser.phone || undefined,
    avatar: supabaseUser.avatar_url || undefined,
    dateOfBirth: undefined, // Пока не используется
    isAdmin: false, // Определяется отдельно
    createdAt: new Date(supabaseUser.created_at),
    updatedAt: new Date(supabaseUser.created_at) // Пока используем created_at
  }
}

export function adaptSupabaseProduct(supabaseProduct: SupabaseProduct): Product {
  return {
    id: supabaseProduct.id,
    name: supabaseProduct.name,
    description: supabaseProduct.description,
    price: supabaseProduct.price,
    image: supabaseProduct.image_url,
    video: supabaseProduct.video_url || undefined,
    category: supabaseProduct.category,
    sizes: supabaseProduct.sizes || undefined,
    in_stock: supabaseProduct.in_stock,
    created_at: supabaseProduct.created_at,
    // Дополнительные поля для совместимости
    collection: undefined,
    article: undefined,
    material: 'Серебро 925°',
    detailedDescription: undefined,
    type: 'classic'
  }
}

export function adaptProductForSupabase(product: Omit<Product, 'id' | 'created_at' | 'in_stock'>): Omit<SupabaseProduct, 'id' | 'created_at'> {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    image_url: product.image,
    video_url: product.video || null,
    category: product.category,
    sizes: product.sizes || null,
    in_stock: true // По умолчанию в наличии
  }
}