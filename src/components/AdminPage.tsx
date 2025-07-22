import React, { useState } from 'react'
import { useRef } from 'react'
import { Button } from './ui/button'
import { ImageWithFallback } from './ImageWithFallback'
import { ProductModal } from './modals/ProductModal'
import { PromoCodeModal } from './modals/PromoCodeModal'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Package, 
  Users, 
  DollarSign,
  Tag,
  Upload,
  Play,
  Download
} from 'lucide-react'
import type { Product, PromoCode, AdminStats } from '../types'

interface AdminPageProps {
  products: Product[]
  onAddProduct: (productData: Omit<Product, 'id'>, files: { images: File[], video?: File }) => void
  onUpdateProduct: (id: string, product: Partial<Product>) => void
  onDeleteProduct: (id: string) => void
  promoCodes: PromoCode[]
  onAddPromoCode: (promoCode: Omit<PromoCode, 'id' | 'createdAt' | 'usageCount'>) => void
  onDeletePromoCode: (id: string) => void
}

export function AdminPage({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  promoCodes,
  onAddPromoCode,
  onDeletePromoCode
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'promo' | 'customers'>('stats')
  const [isTabTransitioning, setIsTabTransitioning] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    price: 0,
    images: [] as string[],
    video: '',
    category: 'rings',
    collection: '',
    article: '',
    material: 'Серебро 925°',
    type: 'classic' as const,
    sizes: ['15', '16', '17', '18', '19', '20', '21']
  })

  const [promoForm, setPromoForm] = useState({
    code: '',
    discount: 0,
    isActive: true,
    maxUsage: undefined as number | undefined
  })

  // Mock stats data
  const stats: AdminStats = {
    totalOrders: 156,
    totalRevenue: 1250000,
    totalProducts: products.length,
    totalUsers: 89,
    recentOrders: []
  }

  // Mock customer data
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        ...productForm,
        image: productForm.images[0] || '', // Use first image as main image for compatibility
      }
      
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productData)
      } else {
        // Convert base64 images to File objects for upload
        const imageFiles: File[] = []
        for (const [index, base64] of productForm.images.entries()) {
          const response = await fetch(base64)
          const blob = await response.blob()
          const file = new File([blob], `image-${index}.jpg`, { type: 'image/jpeg' })
          imageFiles.push(file)
        }
        
        let videoFile: File | undefined
        if (productForm.video) {
          const response = await fetch(productForm.video)
          const blob = await response.blob()
          videoFile = new File([blob], 'video.mp4', { type: 'video/mp4' })
        }
        
        await onAddProduct(productData, { images: imageFiles, video: videoFile })
      }
      
      setIsProductModalOpen(false)
      setEditingProduct(null)
      resetProductForm()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ошибка сохранения товара')
    }
  }

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddPromoCode(promoForm)
    setIsPromoModalOpen(false)
    resetPromoForm()
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      detailedDescription: '',
      price: 0,
      images: [],
      video: '',
      category: 'rings',
      collection: '',
      article: '',
      material: 'Серебро 925°',
      type: 'classic',
      sizes: ['15', '16', '17', '18', '19', '20', '21']
    })
  }

  const resetPromoForm = () => {
    setPromoForm({
      code: '',
      discount: 0,
      isActive: true,
      maxUsage: undefined
    })
  }

  const openEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      detailedDescription: product.detailedDescription || '',
      price: product.price,
      images: [product.image], // Convert single image to array
      video: '',
      category: product.category,
      collection: product.collection || '',
      article: product.article || '',
      material: product.material || 'Серебро 925°',
      type: product.type || 'classic',
      sizes: product.sizes || ['15', '16', '17', '18', '19', '20', '21']
    })
    setIsProductModalOpen(true)
  }

  const handleFileUpload = (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'image' && productForm.images.length < 10) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, result]
          }))
        } else if (type === 'video') {
          setProductForm(prev => ({
            ...prev,
            video: result
          }))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  
  const handleDownloadCatalog = () => {
    // Создаем данные для экспорта
    const catalogData = products.map(product => ({
      'ID': product.id,
      'Название': product.name,
      'Описание': product.description,
      'Цена': product.price,
      'Категория': product.category,
      'Коллекция': product.collection || '',
      'Артикул': product.article || '',
      'Материал': product.material || '',
      'Тип': product.type || '',
      'Размеры': product.sizes?.join(', ') || ''
    }))

    // Создаем CSV контент
    const headers = Object.keys(catalogData[0] || {})
    const csvContent = [
      headers.join(','),
      ...catalogData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n')

    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `savra-catalog-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-silver-bright mb-2">Панель администратора</h1>
          <p className="text-silver-dim">Управление каталогом, статистика и настройки</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-dark rounded-lg p-1">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
              activeTab === 'stats'
                ? 'bg-silver-accent text-silver-bright'
                : 'text-silver-dim hover:text-silver-accent-light'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Статистика
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
              activeTab === 'products'
                ? 'bg-silver-accent text-silver-bright'
                : 'text-silver-dim hover:text-silver-accent-light'
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Товары
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
              activeTab === 'promo'
                ? 'bg-silver-accent text-silver-bright'
                : 'text-silver-dim hover:text-silver-accent-light'
            }`}
          >
            <Tag className="w-4 h-4 mr-2" />
            Промокоды
          </button>
        </div>

        {/* Stats Tab */}
        <div className={`transition-all duration-300 ${
          activeTab === 'stats' 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none absolute'
        }`}>
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-silver-dim text-sm">Всего заказов</p>
                      <p className="text-2xl text-silver-bright">{stats.totalOrders}</p>
                    </div>
                    <Package className="w-8 h-8 text-silver-accent" />
                  </div>
                </div>
                <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-silver-dim text-sm">Выручка</p>
                      <p className="text-2xl text-silver-bright">₽{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-silver-accent" />
                  </div>
                </div>
                <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-silver-dim text-sm">Товаров</p>
                      <p className="text-2xl text-silver-bright">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-silver-accent" />
                  </div>
                </div>
                <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-silver-dim text-sm">Пользователей</p>
                      <p className="text-2xl text-silver-bright">{stats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-silver-accent" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Tab */}
        <div className={`transition-all duration-300 ${
          activeTab === 'products' 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none absolute'
        }`}>
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-silver-bright">Управление товарами</h2>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownloadCatalog}
                    variant="outline"
                    className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Скачать каталог
                  </Button>
                  <Button
                    onClick={() => setIsProductModalOpen(true)}
                    className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить товар
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-graphite rounded-lg border border-slate-dark overflow-hidden">
                    <div className="aspect-square">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-silver-bright mb-2">{product.name}</h3>
                      <p className="text-silver-dim text-sm mb-2">{product.description}</p>
                      <p className="text-chrome mb-4">₽{product.price.toLocaleString()}</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditProduct(product)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-steel-dark text-silver-dim hover:bg-steel-dark"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Изменить
                        </Button>
                        <Button
                          onClick={() => onDeleteProduct(product.id)}
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Promo Codes Tab */}
        <div className={`transition-all duration-300 ${
          activeTab === 'promo' 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none absolute'
        }`}>
          {activeTab === 'promo' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-silver-bright">Промокоды</h2>
                <Button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать промокод
                </Button>
              </div>

              <div className="bg-graphite rounded-lg border border-slate-dark overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-dark">
                      <tr>
                        <th className="px-6 py-3 text-left text-silver-dim">Код</th>
                        <th className="px-6 py-3 text-left text-silver-dim">Скидка</th>
                        <th className="px-6 py-3 text-left text-silver-dim">Статус</th>
                        <th className="px-6 py-3 text-left text-silver-dim">Использований</th>
                        <th className="px-6 py-3 text-left text-silver-dim">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo) => (
                        <tr key={promo.id} className="border-t border-slate-dark">
                          <td className="px-6 py-4 text-silver-bright">{promo.code}</td>
                          <td className="px-6 py-4 text-silver-muted">{promo.discount}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              promo.isActive 
                                ? 'bg-silver-accent text-silver-bright' 
                                : 'bg-slate-dark text-silver-shadow'
                            }`}>
                              {promo.isActive ? 'Активен' : 'Неактивен'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-silver-muted">
                            {promo.usageCount}{promo.maxUsage ? `/${promo.maxUsage}` : ''}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              onClick={() => onDeletePromoCode(promo.id)}
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false)
            setEditingProduct(null)
            resetProductForm()
          }}
          onSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          handleFileUpload={handleFileUpload}
          removeImage={removeImage}
        />

        <PromoCodeModal
          isOpen={isPromoModalOpen}
          onClose={() => {
            setIsPromoModalOpen(false)
            resetPromoForm()
          }}
          onSubmit={handlePromoSubmit}
          promoForm={promoForm}
          setPromoForm={setPromoForm}
        />
      </div>
    </div>
  )
}