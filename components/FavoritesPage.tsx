import React from 'react';
import { Button } from './ui/button';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface FavoritesPageProps {
  favorites: string[];
  onNavigate: (page: string, productId?: string) => void;
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

// Mock favorite products data
const favoriteProducts: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Erosion Ring',
    description: 'Sterling silver with weathered texture',
    price: 145,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  '2': {
    id: '2',
    name: 'Fractured Pendant',
    description: 'Oxidized silver with crack pattern',
    price: 180,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  },
  '3': {
    id: '3',
    name: 'Stone Texture Earrings',
    description: 'Hammered silver with patina finish',
    price: 120,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center&auto=format&q=80'
  }
};

export function FavoritesPage({ favorites, onNavigate, onRemoveFavorite, onAddToCart }: FavoritesPageProps) {
  const favoriteItems = favorites.map(id => favoriteProducts[id]).filter(Boolean);

  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-8 text-obsidian">Your Favorites</h1>
            <div className="bg-stone-light rounded-lg p-12 stone-texture">
              <Heart className="w-16 h-16 text-stone-medium mx-auto mb-6" />
              <h2 className="mb-4 text-charcoal">No favorites yet</h2>
              <p className="text-stone-dark mb-8">
                Start browsing our collection and save the pieces you love.
              </p>
              <Button
                onClick={() => onNavigate('catalog')}
                className="bg-obsidian hover:bg-charcoal text-white px-8 py-3 tracking-wide"
              >
                EXPLORE COLLECTION
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
            className="p-2 hover:bg-stone-light mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
          <h1 className="text-obsidian">Your Favorites ({favoriteItems.length})</h1>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteItems.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4 crack-overlay">
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
                  className="text-obsidian cursor-pointer hover:text-charcoal transition-colors"
                  onClick={() => onNavigate('product', product.id)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-charcoal">{product.description}</p>
                <p className="text-obsidian tracking-wide">${product.price}</p>
              </div>
              
              {/* Quick Actions */}
              <div className="mt-4 flex space-x-2">
                <Button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-obsidian hover:bg-charcoal text-white py-2 text-sm tracking-wide"
                >
                  <ShoppingBag className="w-3 h-3 mr-2" />
                  ADD TO CART
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onRemoveFavorite(product.id)}
                  className="px-3 py-2 border-stone-medium text-stone-dark hover:bg-stone-light hover:text-destructive"
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
              favoriteItems.forEach(product => onAddToCart(product));
            }}
            variant="outline"
            className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-3 tracking-wide mr-4"
          >
            ADD ALL TO CART
          </Button>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-obsidian hover:bg-charcoal text-white px-8 py-3 tracking-wide"
          >
            CONTINUE SHOPPING
          </Button>
        </div>

        {/* Recommendations */}
        <section className="mt-20">
          <h2 className="mb-8 text-center text-obsidian">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="group cursor-pointer" onClick={() => onNavigate('catalog')}>
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4 crack-overlay">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80`}
                    alt={`Recommended product ${index}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-2 text-obsidian">Recommended Ring {index}</h3>
                <p className="text-charcoal">$165</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}