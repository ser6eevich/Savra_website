import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CatalogPage } from './components/CatalogPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutPage } from './components/AboutPage';
import { CartPage } from './components/CartPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ConstructorPage } from './components/ConstructorPage';
import { AdminPage } from './components/AdminPage';
import { ProfilePage } from './components/ProfilePage';
import { NotFoundPage } from './components/NotFoundPage';
import { AuthModal } from './components/AuthModal';
import type { CartItem, Product } from './types';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Кольцо Трещин',
    description: 'Серебряное кольцо с текстурой естественных трещин',
    detailedDescription: 'Уникальное серебряное кольцо, вдохновленное природными процессами выветривания. Каждая трещина и неровность создана вручную, отражая философию ваби-саби.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    collection: 'Эрозия',
    article: 'ER-001',
    material: 'Серебро 925°',
    type: 'classic',
    sizes: ['15', '16', '17', '18', '19', '20', '21']
  },
  {
    id: '2',
    name: 'Кольцо Выветривания',
    description: 'Текстурированное кольцо с патиной времени',
    detailedDescription: 'Изделие создано с использованием специальных техник патинирования, имитирующих естественное старение металла под воздействием времени и стихий.',
    price: 9200,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    collection: 'Время',
    article: 'TM-002',
    material: 'Серебро 925°',
    type: 'textured',
    sizes: ['16', '17', '18', '19', '20', '21', '22']
  },
  {
    id: '3',
    name: 'Кольцо Камня',
    description: 'Массивное кольцо в стиле необработанного камня',
    detailedDescription: 'Вдохновленное формами речных камней, это кольцо передает ощущение природной силы и устойчивости. Подходит для повседневной носки.',
    price: 7800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
    category: 'rings',
    collection: 'Камень',
    article: 'ST-003',
    material: 'Серебро 925°',
    type: 'classic_mens',
    sizes: ['18', '19', '20', '21', '22', '23', '24']
  }
];

const mockPromoCodes = [
  {
    id: '1',
    code: 'SAVRA10',
    discount: 10,
    isActive: true,
    usageCount: 5,
    maxUsage: 100,
    createdAt: new Date()
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'client' | 'admin'>('client');

  // Mock user data
  const mockUser = {
    id: '1',
    firstName: 'Елена',
    lastName: 'Савра',
    email: 'elena@savra.com',
    phone: '+7 (999) 123-45-67',
    dateOfBirth: '1990-01-01',
    avatar: undefined,
    role: userRole,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockOrders = [];

  const handleNavigate = (page: string, productId?: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      if (productId) {
        setSelectedProductId(productId);
      }
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleAddToCart = (product: Product & { quantity?: number; size?: string; orderType?: string }) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1,
      size: product.size,
      orderType: product.orderType || 'catalog'
    };

    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === cartItem.id && item.size === cartItem.size
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.id === cartItem.id && item.size === cartItem.size
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        return [...prev, cartItem];
      }
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => `${item.id}-${item.size}` !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          `${item.id}-${item.size}` === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => `${item.id}-${item.size}` !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // Mock login
      setIsLoggedIn(true);
      if (email === 'admin@savra.com') {
        setUserRole('admin');
      }
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка входа. Проверьте email и пароль.');
    }
  };

  const handleRegister = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      // Mock registration
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      alert('Регистрация успешна!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Ошибка регистрации. Попробуйте еще раз.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggedIn(false);
      setUserRole('client');
      setCurrentPage('home');
      setCartItems([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateOrder = async (orderData: {
    items: CartItem[];
    total: number;
    orderType: 'catalog' | 'constructor';
    promoCode?: string;
    discount?: number;
  }) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      // Mock order creation
      setCartItems([]);
      alert('Заказ успешно создан!');
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Ошибка создания заказа. Попробуйте еще раз.');
    }
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRemoveFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
  };

  const getFavoriteProducts = () => {
    return mockProducts.filter(product => favorites.includes(product.id));
  };

  const validatePromoCode = async (code: string) => {
    const promo = mockPromoCodes.find(p => p.code === code.toUpperCase() && p.isActive);
    return promo || null;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            products={mockProducts}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            products={mockProducts}
          />
        );
      case 'constructor':
        return (
          <ConstructorPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            products={mockProducts}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            promoCodes={mockPromoCodes}
            onCreateOrder={handleCreateOrder}
            validatePromoCode={validatePromoCode}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={getFavoriteProducts()}
            onNavigate={handleNavigate}
            onRemoveFavorite={handleRemoveFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'profile':
        return isLoggedIn ? (
          <ProfilePage
            user={mockUser}
            orders={mockOrders}
            favoriteProducts={getFavoriteProducts()}
            onUpdateUser={() => {}}
            onNavigate={handleNavigate}
          />
        ) : (
          <NotFoundPage onNavigate={handleNavigate} />
        );
      case 'admin':
        return userRole === 'admin' ? (
          <AdminPage
            products={mockProducts}
            onAddProduct={() => {}}
            onUpdateProduct={() => {}}
            onDeleteProduct={() => {}}
            promoCodes={mockPromoCodes}
            onAddPromoCode={() => {}}
            onDeletePromoCode={() => {}}
          />
        ) : (
          <NotFoundPage onNavigate={handleNavigate} />
        );
      case '404':
        return <NotFoundPage onNavigate={handleNavigate} />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartItemCount={getTotalCartItems()}
        favoritesCount={favorites.length}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className={`page-transition ${!isTransitioning ? 'active' : ''}`}>
        {renderCurrentPage()}
      </main>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <footer className="bg-pure-black text-silver-muted py-12 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4 text-silver-bright">Savra Jewelry</h3>
              <p className="text-sm text-silver-dim">
                Украшения ручной работы из серебра, вдохновленные естественным выветриванием и геологической красотой.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-silver-muted">Магазин</h4>
              <div className="space-y-2 text-sm text-silver-dim">
                <button onClick={() => handleNavigate('catalog')} className="block hover:text-silver-accent-light transition-colors">Кольца</button>
                <button onClick={() => handleNavigate('constructor')} className="block hover:text-silver-accent-light transition-colors">Конструктор</button>
                <button onClick={() => handleNavigate('about')} className="block hover:text-silver-accent-light transition-colors">О нас</button>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-silver-muted">Поддержка</h4>
              <div className="space-y-2 text-sm text-silver-dim">
                <button className="block hover:text-silver-accent-light transition-colors">Связаться с Нами</button>
                <button className="block hover:text-silver-accent-light transition-colors">Таблица Размеров</button>
                <button className="block hover:text-silver-accent-light transition-colors">Уход за Изделиями</button>
                <button className="block hover:text-silver-accent-light transition-colors">Возврат</button>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-silver-muted">Связь</h4>
              <div className="space-y-2 text-sm text-silver-dim">
                <button className="block hover:text-silver-accent-light transition-colors">Instagram</button>
                <button className="block hover:text-silver-accent-light transition-colors">Telegram</button>
                <button className="block hover:text-silver-accent-light transition-colors">WhatsApp</button>
              </div>
            </div>
          </div>
          <div className="border-t border-graphite mt-8 pt-8 text-center text-sm text-silver-shadow">
            <p>&copy; 2025 Savra Jewelry. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}