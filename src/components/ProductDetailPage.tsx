import React, { useState } from 'react';
import { Button } from './ui/button';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import type { Product } from '../types';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product & { size: string }) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: string[];
  products: Product[];
}

export function ProductDetailPage({ productId, onNavigate, onAddToCart, onToggleFavorite, favorites, products }: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const product = products.find(p => p.id === productId) || products[0];
  if (!product) {
    return <NotFoundPage onNavigate={onNavigate} />;
  }
  
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart({ ...product, size: selectedSize });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('catalog')}
          className="mb-8 p-2 hover:bg-graphite text-silver-dim hover:text-silver-accent-light"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к каталогу
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-graphite rounded-lg overflow-hidden border border-slate-dark">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Additional Images */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square bg-graphite rounded border border-slate-dark">
                  <ImageWithFallback
                    src={product.image}
                    alt={`${product.name} вид ${index}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <Badge variant="secondary" className="mb-2 bg-slate-dark text-silver-dim">
                {product.collection}
              </Badge>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-silver-bright">{product.name}</h1>
                <Button
                  variant="ghost"
                  onClick={() => onToggleFavorite(product.id)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isFavorite 
                      ? 'bg-silver-accent text-silver-bright hover:bg-silver-accent-light' 
                      : 'text-silver-dim hover:text-silver-accent-light hover:bg-graphite'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <p className="text-silver-dim">{product.description}</p>
            </div>

            {/* Price */}
            <div className="py-4 border-t border-b border-slate-dark">
              <span className="text-2xl text-chrome tracking-wide">₽{product.price.toLocaleString()}</span>
            </div>

            {/* Key Characteristics */}
            <div className="space-y-4">
              <h3 className="text-silver-bright">Характеристики</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between py-2 border-b border-slate-dark">
                  <span className="text-silver-dim">Материал:</span>
                  <span className="text-silver-muted">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-dark">
                  <span className="text-silver-dim">Коллекция:</span>
                  <span className="text-silver-muted">{product.collection}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-dark">
                  <span className="text-silver-dim">Артикул:</span>
                  <span className="text-silver-muted">{product.article}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-dark">
                  <span className="text-silver-dim">Время изготовления:</span>
                  <span className="text-silver-muted">7-10 дней</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="text-silver-bright">Выберите размер</h3>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full border-slate-dark bg-graphite text-silver-muted">
                  <SelectValue placeholder="Выберите размер кольца" />
                </SelectTrigger>
                <SelectContent className="bg-graphite border-slate-dark">
                  {product.sizes?.map((size) => (
                    <SelectItem key={size} value={size} className="text-silver-muted hover:bg-slate-dark">
                      Размер {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-silver-shadow">
                Не знаете свой размер? <button className="text-silver-accent hover:text-silver-accent-light">Таблица размеров</button>
              </p>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Добавить в корзину
            </Button>

            {/* Product Description */}
            <div className="space-y-4 pt-6 border-t border-slate-dark">
              <h3 className="text-silver-bright">Описание</h3>
              <p className="text-silver-dim leading-relaxed">
                {product.detailedDescription}
              </p>
            </div>

            {/* Care Instructions */}
            <div className="space-y-4 pt-6 border-t border-slate-dark">
              <h3 className="text-silver-bright">Уход за изделием</h3>
              <div className="text-silver-dim space-y-2">
                <p>• Храните в сухом месте, избегайте контакта с влагой</p>
                <p>• Очищайте мягкой тканью или специальной салфеткой для серебра</p>
                <p>• Избегайте контакта с химическими веществами</p>
                <p>• Снимайте украшения перед занятиями спортом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}