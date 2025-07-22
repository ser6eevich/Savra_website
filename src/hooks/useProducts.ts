import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        return
      }

      const formattedProducts: Product[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        detailedDescription: item.detailed_description,
        price: item.price,
        image: item.images[0] || '',
        category: item.category,
        collection: item.collection,
        article: item.article,
        material: item.material,
        type: item.type as Product['type'],
        sizes: item.sizes
      }))

      setProducts(formattedProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, 'id'> & { images: string[] }) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          detailed_description: productData.detailedDescription || '',
          price: productData.price,
          category: productData.category,
          collection: productData.collection || '',
          article: productData.article || '',
          material: productData.material || 'Серебро 925°',
          type: productData.type || 'classic',
          sizes: productData.sizes || ['15', '16', '17', '18', '19', '20', '21'],
          images: productData.images
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      await loadProducts() // Перезагружаем список
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Unknown error') }
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product> & { images?: string[] }) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          detailed_description: updates.detailedDescription,
          price: updates.price,
          category: updates.category,
          collection: updates.collection,
          article: updates.article,
          material: updates.material,
          type: updates.type,
          sizes: updates.sizes,
          images: updates.images
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      await loadProducts() // Перезагружаем список
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Unknown error') }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        throw error
      }

      await loadProducts() // Перезагружаем список
      return { error: null }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Unknown error') }
    }
  }

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}