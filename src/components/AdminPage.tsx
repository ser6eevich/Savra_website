import React, { useState } from 'react'
import { useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Modal } from './ui/modal'
import { ImageWithFallback } from './ImageWithFallback'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Package, 
  Users, 
  DollarSign,
  Tag,
  Settings,
  Upload,
  X,
  Play
} from 'lucide-react'
import type { Product, PromoCode, AdminStats } from '../types'

interface AdminPageProps {
  products: Product[]
  onAddProduct: (product: Omit<Product, 'id'>) => void
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
  const videoInputRef = useRef<HTMLInputElement>(null)
  
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
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const productData = {
      ...productForm,
      image: productForm.images[0] || '', // Use first image as main image for compatibility
    }
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData)
    } else {
      onAddProduct(productData)
    }
    setIsProductModalOpen(false)
    setEditingProduct(null)
    resetProductForm()
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

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-silver-bright">Управление товарами</h2>
              <Button
                onClick={() => setIsProductModalOpen(true)}
                className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
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

        {/* Promo Codes Tab */}
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

        {/* Product Modal */}
        <Modal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false)
            setEditingProduct(null)
            resetProductForm()
          }}
          title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
          className="max-w-2xl"
        >
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="border-slate-dark bg-slate-dark text-silver-muted"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="border-slate-dark bg-slate-dark text-silver-muted"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Краткое описание</Label>
              <Input
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                className="border-slate-dark bg-slate-dark text-silver-muted"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label>Фотографии товара (до 10 штук)</Label>
              <div 
                className="border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-silver-accent transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-8 text-silver-shadow mx-auto mb-2" />
                <p className="text-silver-dim">Перетащите фото или нажмите для выбора</p>
                <p className="text-silver-shadow text-sm">PNG, JPG до 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files, 'image')}
                className="hidden"
              />
              
              {/* Image Preview */}
              {productForm.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {productForm.images.map((image, index) => (
                    <div key={index} className="relative aspect-square bg-slate-dark rounded overflow-hidden">
                      <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 p-0 bg-destructive hover:bg-destructive/80"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-4">
              <Label>Видео товара (1 видео)</Label>
              <div 
                className="border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-silver-accent transition-colors cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                <Play className="w-8 h-8 text-silver-shadow mx-auto mb-2" />
                <p className="text-silver-dim">Перетащите видео или нажмите для выбора</p>
                <p className="text-silver-shadow text-sm">MP4, MOV до 50MB</p>
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload(e.target.files, 'video')}
                className="hidden"
              />
              
              {/* Video Preview */}
              {productForm.video && (
                <div className="relative aspect-video bg-slate-dark rounded overflow-hidden">
                  <video src={productForm.video} className="w-full h-full object-cover" controls />
                  <Button
                    type="button"
                    onClick={() => setProductForm(prev => ({ ...prev, video: '' }))}
                    className="absolute top-2 right-2 w-8 h-8 p-0 bg-destructive hover:bg-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collection">Коллекция</Label>
                <Input
                  id="collection"
                  value={productForm.collection}
                  onChange={(e) => setProductForm(prev => ({ ...prev, collection: e.target.value }))}
                  className="border-slate-dark bg-slate-dark text-silver-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article">Артикул</Label>
                <Input
                  id="article"
                  value={productForm.article}
                  onChange={(e) => setProductForm(prev => ({ ...prev, article: e.target.value }))}
                  className="border-slate-dark bg-slate-dark text-silver-muted"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
            >
              {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
            </Button>
          </form>
        </Modal>

        {/* Promo Code Modal */}
        <Modal
          isOpen={isPromoModalOpen}
          onClose={() => {
            setIsPromoModalOpen(false)
            resetPromoForm()
          }}
          title="Создать промокод"
        >
          <form onSubmit={handlePromoSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код промокода</Label>
              <Input
                id="code"
                value={promoForm.code}
                onChange={(e) => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="border-slate-dark bg-slate-dark text-silver-muted"
                placeholder="SAVRA10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Размер скидки (%)</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={promoForm.discount}
                onChange={(e) => setPromoForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                className="border-slate-dark bg-slate-dark text-silver-muted"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsage">Максимальное количество использований (необязательно)</Label>
              <Input
                id="maxUsage"
                type="number"
                min="1"
                value={promoForm.maxUsage || ''}
                onChange={(e) => setPromoForm(prev => ({ 
                  ...prev, 
                  maxUsage: e.target.value ? Number(e.target.value) : undefined 
                }))}
                className="border-slate-dark bg-slate-dark text-silver-muted"
                placeholder="Без ограничений"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
            >
              Создать промокод
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}