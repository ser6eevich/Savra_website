import React, { useState } from 'react';
import { Button } from './ui/button';
import { Heart, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  type: 'classic' | 'textured' | 'mens' | 'classic_mens' | 'textured_mens';
}

interface CatalogPageProps {
  onNavigate: (page: string, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: string[];
}

const rings: Product[] = [
  // Classic Rings (1-8)
  {
    id: '1',
    name: 'Кольцо Классик',
    description: 'Элегантное серебро с полированной поверхностью',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '2',
    name: 'Кольцо Минимал',
    description: 'Тонкое серебряное кольцо простой формы',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '3',
    name: 'Кольцо Элегант',
    description: 'Классическое серебро с глянцевой отделкой',
    price: 9200,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '4',
    name: 'Кольцо Грация',
    description: 'Изящное серебряное кольцо с плавными линиями',
    price: 7900,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '5',
    name: 'Кольцо Утончение',
    description: 'Деликатное серебро с матовой поверхностью',
    price: 8100,
    image: 'https://images.unsplash.com/photo-1596944946645-d9fcfd2b7684?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '6',
    name: 'Кольцо Софт',
    description: 'Мягкие формы в классическом серебре',
    price: 7500,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '7',
    name: 'Кольцо Люкс',
    description: 'Премиальное серебро высокого качества',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },
  {
    id: '8',
    name: 'Кольцо Идеал',
    description: 'Совершенные пропорции в серебре',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic'
  },

  // Textured Rings (9-16)
  {
    id: '9',
    name: 'Кольцо Эрозии',
    description: 'Серебро с выветренной текстурой камня',
    price: 10250,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '10',
    name: 'Кольцо Трещин',
    description: 'Серебро с узором древних разломов',
    price: 11400,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '11',
    name: 'Кольцо Патины',
    description: 'Окисленное серебро с темной патиной',
    price: 12300,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '12',
    name: 'Кольцо Коры',
    description: 'Текстура древесной коры в серебре',
    price: 10800,
    image: 'https://images.unsplash.com/photo-1596944946645-d9fcfd2b7684?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '13',
    name: 'Кольцо Волн',
    description: 'Рельеф морских волн на серебре',
    price: 11700,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '14',
    name: 'Кольцо Молота',
    description: 'Молотая текстура ручной работы',
    price: 13200,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '15',
    name: 'Кольцо Пламени',
    description: 'Огненная текстура в темном серебре',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },
  {
    id: '16',
    name: 'Кольцо Вулкана',
    description: 'Лавовая текстура с окислением',
    price: 15800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured'
  },

  // Men's Sizes - Classic (17-20)
  {
    id: '17',
    name: 'Кольцо Силы',
    description: 'Широкое классическое серебро для мужчин',
    price: 15200,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic_mens'
  },
  {
    id: '18',
    name: 'Кольцо Авторитет',
    description: 'Массивное серебро с полированной поверхностью',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic_mens'
  },
  {
    id: '19',
    name: 'Кольцо Лидер',
    description: 'Представительное серебро строгих форм',
    price: 16800,
    image: 'https://images.unsplash.com/photo-1596944946645-d9fcfd2b7684?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic_mens'
  },
  {
    id: '20',
    name: 'Кольцо Статус',
    description: 'Элегантное мужское серебро премиум класса',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'classic_mens'
  },

  // Men's Sizes - Textured (21-24)
  {
    id: '21',
    name: 'Кольцо Воин',
    description: 'Боевая текстура на широком серебре',
    price: 19200,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured_mens'
  },
  {
    id: '22',
    name: 'Кольцо Титан',
    description: 'Металлическая текстура с патиной',
    price: 21500,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured_mens'
  },
  {
    id: '23',
    name: 'Кольцо Шторм',
    description: 'Бурная текстура темного серебра',
    price: 20800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured_mens'
  },
  {
    id: '24',
    name: 'Кольцо Гром',
    description: 'Молниеносная текстура на массивном серебре',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    type: 'textured_mens'
  }
];

const categoryNames = {
  all: 'Все',
  classic: 'Классические',
  textured: 'Текстурные',
  mens: 'Мужские размеры'
};

export function CatalogPage({ onNavigate, onAddToCart, onToggleFavorite, favorites }: CatalogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = ['all', 'classic', 'textured', 'mens'];
  
  const filteredRings = selectedCategory === 'all' 
    ? rings 
    : rings.filter(ring => {
        switch (selectedCategory) {
          case 'classic':
            return ring.type === 'classic' || ring.type === 'classic_mens';
          case 'textured':
            return ring.type === 'textured' || ring.type === 'textured_mens';
          case 'mens':
            return ring.type === 'classic_mens' || ring.type === 'textured_mens';
          default:
            return true;
        }
      });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4 text-silver-bright">Коллекция Колец</h1>
          <p className="text-silver-dim max-w-2xl mx-auto">
            Исследуйте нашу полную коллекцию из 24 уникальных серебряных колец ручной работы. 
            Каждое кольцо создано с особым вниманием к деталям и вдохновлено природными текстурами.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`tracking-wide transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-silver-accent text-silver-bright hover:bg-silver-accent-light'
                  : 'border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright'
              }`}
            >
              {categoryNames[category as keyof typeof categoryNames]}
            </Button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="text-center mb-8">
          <p className="text-silver-shadow">
            Найдено {filteredRings.length} из {rings.length} моделей
          </p>
        </div>

        {/* Ring Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRings.map((ring) => (
            <div key={ring.id} className="bg-graphite rounded-lg border border-slate-dark overflow-hidden transition-all duration-300 hover:border-silver-accent">
              <div className="aspect-square overflow-hidden">
                <ImageWithFallback
                  src={ring.image}
                  alt={ring.name}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => onNavigate('product', ring.id)}
                />
              </div>
              
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <h3 
                    className="text-silver-bright cursor-pointer hover:text-chrome transition-colors"
                    onClick={() => onNavigate('product', ring.id)}
                  >
                    {ring.name}
                  </h3>
                  <p className="text-sm text-silver-dim">{ring.description}</p>
                  <p className="text-chrome tracking-wide">₽{ring.price.toLocaleString()}</p>
                </div>
                
                {/* Always visible action buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => onToggleFavorite(ring.id)}
                    variant="outline"
                    className={`flex-1 transition-all duration-300 ${
                      favorites.includes(ring.id) 
                        ? 'bg-silver-accent text-silver-bright border-silver-accent hover:bg-silver-accent-light' 
                        : 'border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${favorites.includes(ring.id) ? 'fill-current' : ''}`} />
                    {favorites.includes(ring.id) ? 'В избранном' : 'В избранное'}
                  </Button>
                  <Button
                    onClick={() => onAddToCart(ring)}
                    className="flex-1 bg-silver-accent hover:bg-silver-accent-light text-silver-bright transition-all duration-300"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    В корзину
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <div className="text-silver-shadow text-sm mb-4">
            Показаны все доступные модели
          </div>
          <Button 
            variant="outline"
            onClick={() => onNavigate('about')}
            className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
          >
            Узнать о новых коллекциях
          </Button>
        </div>
      </div>
    </div>
  );
}