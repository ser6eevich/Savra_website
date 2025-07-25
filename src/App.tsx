import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
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
import type { CartItem, Order, PromoCode } from './types';

export default function App() {
  const { profile, loading: authLoading, signOut } = useAuth()
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts()
  const [currentPage, setCurrentPage] = useState('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['1', '2']); // Demo favorites
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

  // Показываем загрузку пока идет инициализация
  if (authLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-silver-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-silver-dim">Загрузка...</p>
        </div>
      </div>
    )
  }

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

  const handleLogout = () => {
    signOut();
    setCurrentPage('home');
  };

  const handleUpdateUser = (userData: any) => {
    // Обновление профиля через useAuth hook
    console.log('Update user:', userData);
  };

  const handleAddProduct = async (productData: any) => {
    await addProduct(productData);
  };

  const handleUpdateProduct = async (id: string, productData: any) => {
    await updateProduct(id, productData);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
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
            onClearCart={() => setCartItems([])}
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
        return profile ? (
          <ProfilePage
            user={profile}
            orders={orders}
            favoriteProducts={getFavoriteProducts()}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
          />
        ) : (
          <NotFoundPage onNavigate={handleNavigate} />
        );
      case 'admin':
        return profile?.isAdmin ? (
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
        isLoggedIn={!!profile}
        isAdmin={!!profile?.isAdmin}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className={`page-transition ${!isTransitioning ? 'active' : ''}`}>
        {renderCurrentPage()}
      </main>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
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