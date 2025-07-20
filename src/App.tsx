import React, { useState } from 'react';
import { useEffect } from 'react';
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
import type { CartItem, Product, User, Order, PromoCode } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['1', '2']); // Demo favorites
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([
    // Existing products from CatalogPage
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
    }
  ]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: '1',
      code: 'SAVRA10',
      discount: 10,
      isActive: true,
      createdAt: new Date(),
      usageCount: 5,
      maxUsage: 100
    }
  ]);

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

  const handleAddToCart = (product: Product & { quantity?: number; size?: string }) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1,
      size: product.size,
      orderType: (product as any).orderType || 'catalog' // Определяем тип заказа
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

  const handleLogin = (email: string, password: string) => {
    // Mock login logic
    const mockUser: User = {
      id: '1',
      firstName: 'Елена',
      lastName: 'Савра',
      email: email,
      phone: '+7 (999) 123-45-67',
      isAdmin: email === 'admin@savra.com',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentUser(mockUser);
  };

  const handleRegister = (userData: any) => {
    // Mock registration logic
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...userData, updatedAt: new Date() } : null);
    }
  };

  const handleAddProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const handleAddPromoCode = (promoData: Omit<PromoCode, 'id' | 'createdAt' | 'usageCount'>) => {
    const newPromo: PromoCode = {
      ...promoData,
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0
    };
    setPromoCodes(prev => [...prev, newPromo]);
  };

  const handleDeletePromoCode = (id: string) => {
    setPromoCodes(prev => prev.filter(promo => promo.id !== id));
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getFavoriteProducts = () => {
    return products.filter(product => favorites.includes(product.id));
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
            products={products}
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
            products={products}
          />
        );
      case 'constructor':
        return (
          <ConstructorPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            products={products}
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
            promoCodes={promoCodes}
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
        return currentUser ? (
          <ProfilePage
            user={currentUser}
            orders={orders}
            favoriteProducts={getFavoriteProducts()}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
          />
        ) : (
          <NotFoundPage onNavigate={handleNavigate} />
        );
      case 'admin':
        return currentUser?.isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            promoCodes={promoCodes}
            onAddPromoCode={handleAddPromoCode}
            onDeletePromoCode={handleDeletePromoCode}
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
        isLoggedIn={!!currentUser}
        isAdmin={!!currentUser?.isAdmin}
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