import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Notification } from './ui/notification'
import { ProductSelectionModal } from './modals/ProductSelectionModal'
import { ImageWithFallback } from './ImageWithFallback'
import { ShoppingBag, Wrench } from 'lucide-react'
import type { Product } from '../types'

interface ConstructorPageProps {
  onNavigate: (page: string) => void
  onAddToCart: (product: Product & { size: string }) => void
  products: Product[]
}

const categories = [
  { id: 'all', name: 'Все' },
  { id: 'classic', name: 'Классические' },
  { id: 'textured', name: 'Текстурные' },
  { id: 'mens', name: 'Мужские' }
]


export function ConstructorPage({ onNavigate, onAddToCart, products }: ConstructorPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [showOrderNotification, setShowOrderNotification] = useState(false)

  const filteredProducts = selectedCategory 
    ? products.filter(product => {
        if (selectedCategory === 'all') return true
        switch (selectedCategory) {
          case 'classic':
            return product.type === 'classic' || product.type === 'classic_mens'
          case 'textured':
            return product.type === 'textured' || product.type === 'textured_mens'
          case 'mens':
            return product.type === 'classic_mens' || product.type === 'textured_mens'
          default:
            return true
        }
      })
    : []

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedProduct(null)
    setSelectedSize('')
    
    if (categoryId) {
      setTimeout(() => {
        setIsProductModalOpen(true)
      }, 300)
    }
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize('')
    setIsProductModalOpen(false)
  }

  const handleCreateOrder = () => {
    if (selectedProduct && selectedSize) {
      // Добавляем метку что это заказ из конструктора
      onAddToCart({ ...selectedProduct, size: selectedSize, orderType: 'constructor' })
      setShowOrderNotification(true)
    }
  }

  const isOrderReady = selectedCategory && selectedProduct && selectedSize

  return (
    <div className="min-h-screen py-8">
      <Notification
        isOpen={showOrderNotification}
        onClose={() => setShowOrderNotification(false)}
        type="success"
        title="Заказ сформирован!"
        message="Ваш индивидуальный заказ добавлен в корзину. Наш мастер изготовит кольцо специально для вас в течение 7-14 дней."
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-silver-accent mr-3" />
            <h1 className="text-silver-bright">Конструктор Колец</h1>
          </div>
          <p className="text-silver-dim max-w-2xl mx-auto">
            Создайте идеальное кольцо, выбрав категорию, модель и размер. 
            Все изделия изготавливаются вручную из серебра 925 пробы.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Configuration Panel */}
            <div className="space-y-8">
              {/* Step 1: Category */}
              <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                <h3 className="text-silver-bright mb-4 flex items-center">
                  <span className="w-8 h-8 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  Выберите категорию
                </h3>
                <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                  <SelectTrigger className="border-slate-dark bg-slate-dark text-silver-muted">
                    <SelectValue placeholder="Выберите стиль кольца" />
                  </SelectTrigger>
                  <SelectContent className="bg-graphite border-slate-dark">
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="text-silver-muted hover:bg-slate-dark"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Selected Product */}
              <div className={`transition-all duration-500 ease-out ${
                selectedProduct 
                  ? 'opacity-100 max-h-96 translate-y-0' 
                  : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'
              }`}>
                {selectedProduct && (
                  <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                    <h3 className="text-silver-bright mb-4 flex items-center">
                      <span className="w-8 h-8 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      Выбранная модель
                    </h3>
                    <div className="flex gap-4 p-4 bg-slate-dark rounded-lg border border-silver-accent">
                      <div className="w-20 h-20 overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-silver-bright mb-1">{selectedProduct.name}</h4>
                        <p className="text-silver-dim text-sm mb-2">{selectedProduct.description}</p>
                        <p className="text-chrome">₽{selectedProduct.price.toLocaleString()}</p>
                      </div>
                      <Button
                        onClick={() => setIsProductModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="border-steel-dark text-silver-dim hover:bg-steel-dark"
                      >
                        Изменить
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Size */}
              <div className={`transition-all duration-500 ease-out delay-200 ${
                selectedProduct 
                  ? 'opacity-100 max-h-96 translate-y-0' 
                  : 'opacity-0 max-h-0 -translate-y-4 overflow-hidden'
              }`}>
                {selectedProduct && (
                  <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
                    <h3 className="text-silver-bright mb-4 flex items-center">
                      <span className="w-8 h-8 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      Выберите размер
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="ring-size" className="text-silver-dim">Размер кольца</Label>
                      <Input
                        id="ring-size"
                        type="number"
                        min="10"
                        max="30"
                        step="0.5"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        placeholder="Например: 18.5"
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                      />
                    </div>
                    <p className="text-sm text-silver-shadow mt-2">
                      Не знаете свой размер? <button className="text-silver-accent hover:text-silver-accent-light">Таблица размеров</button>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-graphite rounded-lg p-6 border border-slate-dark h-fit sticky top-8">
              <h3 className="text-silver-bright mb-6">Предварительный просмотр</h3>
              
              {selectedProduct ? (
                <div className="space-y-6">
                  <div className="aspect-square bg-slate-dark rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-silver-bright text-lg mb-2">{selectedProduct.name}</h4>
                      <p className="text-silver-dim text-sm">{selectedProduct.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-silver-dim">Категория:</span>
                        <span className="text-silver-muted">
                          {categories.find(c => c.id === selectedCategory)?.name}
                        </span>
                      </div>
                      {selectedSize && (
                        <div className="flex justify-between">
                          <span className="text-silver-dim">Размер:</span>
                          <span className="text-silver-muted">{selectedSize}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-silver-dim">Материал:</span>
                        <span className="text-silver-muted">Серебро 925°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-silver-dim">Изготовление:</span>
                        <span className="text-silver-muted">7-10 дней</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-dark pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-silver-bright text-lg">Итого:</span>
                        <span className="text-chrome text-xl">₽{selectedProduct.price.toLocaleString()}</span>
                      </div>
                      
                      <Button
                        onClick={handleCreateOrder}
                        disabled={!isOrderReady}
                        className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Сформировать заказ
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-dark rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-12 h-12 text-silver-shadow" />
                  </div>
                  <p className="text-silver-dim">
                    Выберите категорию и модель кольца для предварительного просмотра
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Selection Modal */}
        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          title={`Выберите модель (${filteredProducts.length} доступно)`}
          products={filteredProducts}
          onSelectProduct={handleProductSelect}
        />
        {/* Info Section */}
        <div className="mt-16 bg-slate-dark rounded-lg p-8">
          <h3 className="text-silver-bright mb-6 text-center">Как работает конструктор</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center mx-auto mb-4">1</div>
              <h4 className="text-silver-muted mb-2">Выберите стиль</h4>
              <p className="text-silver-dim text-sm">Классические, текстурные или мужские модели</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center mx-auto mb-4">2</div>
              <h4 className="text-silver-muted mb-2">Выберите модель</h4>
              <p className="text-silver-dim text-sm">Из доступных вариантов в выбранной категории</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-silver-accent text-silver-bright rounded-full flex items-center justify-center mx-auto mb-4">3</div>
              <h4 className="text-silver-muted mb-2">Укажите размер</h4>
              <p className="text-silver-dim text-sm">И сформируйте заказ для изготовления</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}