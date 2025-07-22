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
import { useAuth } from './hooks/useAuth';
import { isSupabaseReady } from './lib/supabase';
import { useProducts } from './hooks/useProducts';
import { useFavorites } from './hooks/useFavorites';
import { useOrders } from './hooks/useOrders';
import { usePromoCodes } from './hooks/usePromoCodes';
import type { CartItem } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Supabase hooks
  const { user, loading: authLoading, signUp, signIn, signOut, updateProfile } = useAuth();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { favorites, toggleFavorite, removeFavorite } = useFavorites(user?.id || null);
  const { orders, createOrder } = useOrders(user?.id || null);
  const { promoCodes, addPromoCode, deletePromoCode, validatePromoCode } = usePromoCodes();

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

  const handleAddToCart = (product: any) => {
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

  const handleLogin = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error && error.message.includes('Supabase environment variables')) {
        alert('❌ Supabase не настроен! Проверьте консоль для инструкций по настройке.');
      } else {
        alert('Ошибка входа. Проверьте email и пароль или настройки Supabase.');
      }
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      await signUp(userData.email, userData.password, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone
      });
      setIsAuthModalOpen(false);
      alert('Регистрация успешна! Проверьте email для подтверждения.');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Ошибка регистрации. Попробуйте еще раз.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddProduct = async (productData: any, files: { images: File[], video?: File }) => {
    try {
      await addProduct(productData, files);
    } catch (error) {
      console.error('Add product error:', error);
      alert('Ошибка добавления товара');
    }
  };

  const handleAddPromoCode = async (promoData: any) => {
    try {
      await addPromoCode(promoData);
    } catch (error) {
      console.error('Add promo code error:', error);
      alert('Ошибка создания промокода');
    }
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getFavoriteProducts = () => {
    return products.filter(product => favorites.includes(product.id));
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-silver-dim">Загрузка...</div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
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
            onToggleFavorite={toggleFavorite}
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
            onClearCart={() => setCartItems([])}
            promoCodes={promoCodes}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={getFavoriteProducts()}
            onNavigate={handleNavigate}
            onRemoveFavorite={removeFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      case 'profile':
        return user ? (
          <ProfilePage
            user={user}
            orders={orders}
            favoriteProducts={getFavoriteProducts()}
            onUpdateUser={updateProfile}
            onNavigate={handleNavigate}
          />
        ) : (
          <NotFoundPage onNavigate={handleNavigate} />
        );
      case 'admin':
        return user?.isAdmin ? (
          <AdminPage
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            promoCodes={promoCodes}
            onAddPromoCode={handleAddPromoCode}
            onDeletePromoCode={deletePromoCode}
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
        isLoggedIn={!!user}
        isAdmin={!!user?.isAdmin}
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