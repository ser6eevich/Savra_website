import React from 'react';
import { Button } from './ui/button';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import type { Product } from '../types';

interface FavoritesPageProps {
  favorites: Product[];
  onNavigate: (page: string, productId?: string) => void;
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export function FavoritesPage({ favorites, onNavigate, onRemoveFavorite, onAddToCart }: FavoritesPageProps) {
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-8 text-silver-bright">Избранное</h1>
            <div className="bg-graphite rounded-lg p-12 border border-slate-dark">
              <Heart className="w-16 h-16 text-silver-accent mx-auto mb-6" />
              <h2 className="mb-4 text-silver-muted">Пока нет избранных товаров</h2>
              <p className="text-silver-dim mb-8">
                Начните просматривать нашу коллекцию и сохраняйте понравившиеся изделия.
              </p>
              <Button
                onClick={() => onNavigate('catalog')}
                className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-8 py-3 tracking-wide"
              >
                ИЗУЧИТЬ КОЛЛЕКЦИЮ
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('catalog')}
            className="p-2 hover:bg-graphite mr-4 text-silver-dim hover:text-silver-accent-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Продолжить покупки
          </Button>
          <h1 className="text-silver-bright">Избранное ({favorites.length})</h1>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square bg-graphite rounded-lg overflow-hidden mb-4 border border-slate-dark">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => onNavigate('product', product.id)}
                />
                
                {/* Overlay actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onRemoveFavorite(product.id)}
                    className="w-8 h-8 p-0 rounded-full bg-white/90 text-destructive hover:bg-white hover:text-destructive"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onAddToCart(product)}
                    className="w-8 h-8 p-0 rounded-full bg-white/90 text-charcoal hover:bg-white"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 
                  className="text-silver-bright cursor-pointer hover:text-chrome transition-colors"
                  onClick={() => onNavigate('product', product.id)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-silver-dim">{product.description}</p>
                <p className="text-chrome tracking-wide">₽{product.price.toLocaleString()}</p>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 flex space-x-2">
                <Button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-2 text-sm tracking-wide"
                >
                  <ShoppingBag className="w-3 h-3 mr-2" />
                  В КОРЗИНУ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onRemoveFavorite(product.id)}
                  className="px-3 py-2 border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-destructive"
                >
                  <Heart className="w-3 h-3 fill-current" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => {
              favorites.forEach(product => onAddToCart(product));
            }}
            variant="outline"
            className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright px-8 py-3 tracking-wide mr-4"
          >
            ДОБАВИТЬ ВСЁ В КОРЗИНУ
          </Button>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-8 py-3 tracking-wide"
          >
            ПРОДОЛЖИТЬ ПОКУПКИ
          </Button>
        </div>

        {/* Recommendations */}
        <section className="mt-20">
          <h2 className="mb-8 text-center text-silver-bright">Вам Может Понравиться</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="group cursor-pointer" onClick={() => onNavigate('catalog')}>
                <div className="aspect-square bg-graphite rounded-lg overflow-hidden mb-4 border border-slate-dark">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80`}
                    alt={`Рекомендуемый товар ${index}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-2 text-silver-bright">Рекомендуемое Кольцо {index}</h3>
                <p className="text-chrome">₽9,500</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}