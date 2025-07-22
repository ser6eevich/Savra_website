import { useState, useEffect } from 'react'
import { supabase, uploadFile, getPublicUrl, deleteFile } from '../lib/supabase'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        detailedDescription: product.detailed_description,
        price: product.price,
        image: product.images[0] || '',
        category: product.category,
        collection: product.collection,
        article: product.article,
        material: product.material,
        type: product.type as any,
        sizes: product.sizes
      }))

      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, 'id'>, files: {
    images: File[]
    video?: File
  }) => {
    try {
      // Upload images
      const imageUrls: string[] = []
      for (const [index, file] of files.images.entries()) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${index}.${fileExt}`
        await uploadFile('product-images', fileName, file)
        const publicUrl = getPublicUrl('product-images', fileName)
        imageUrls.push(publicUrl)
      }

      // Upload video if provided
      let videoUrl: string | null = null
      if (files.video) {
        const fileExt = files.video.name.split('.').pop()
        const videoFileName = `${Date.now()}-video.${fileExt}`
        await uploadFile('product-videos', videoFileName, files.video)
        videoUrl = getPublicUrl('product-videos', videoFileName)
      }

      // Insert product
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          detailed_description: productData.detailedDescription,
          price: productData.price,
          category: productData.category,
          collection: productData.collection,
          article: productData.article,
          material: productData.material || 'Серебро 925°',
          type: productData.type || 'classic',
          sizes: productData.sizes || [],
          images: imageUrls,
          video_url: videoUrl
        })
        .select()
        .single()

      if (error) throw error

      await fetchProducts() // Refresh products list
      return data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
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
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      await fetchProducts() // Refresh products list
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      // Get product to delete associated files
      const { data: product } = await supabase
        .from('products')
        .select('images, video_url')
        .eq('id', id)
        .single()

      if (product) {
        // Delete images
        for (const imageUrl of product.images) {
          const fileName = imageUrl.split('/').pop()
          if (fileName) {
            await deleteFile('product-images', fileName)
          }
        }

        // Delete video if exists
        if (product.video_url) {
          const videoFileName = product.video_url.split('/').pop()
          if (videoFileName) {
            await deleteFile('product-videos', videoFileName)
          }
        }
      }

      // Delete product record
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchProducts() // Refresh products list
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  }
}