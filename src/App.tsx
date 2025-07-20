import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/HomePage';
import { CatalogPage } from '@/components/CatalogPage';
import { ProductDetailPage } from '@/components/ProductDetailPage';
import { AboutPage } from '@/components/AboutPage';
import { CartPage } from '@/components/CartPage';
import { FavoritesPage } from '@/components/FavoritesPage';
import { RegisterPage } from '@/components/RegisterPage';
import { NotFoundPage } from '@/components/NotFoundPage';
import { CartItem, Product } from '@/types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === product.id);
      if (isFavorite) {
        return prev.filter(fav => fav.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const navigateTo = (page: string, product?: Product) => {
    setCurrentPage(page);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'catalog':
        return (
          <CatalogPage
            onNavigate={navigateTo}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        );
      case 'product':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={navigateTo}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.some(fav => fav.id === selectedProduct.id)}
          />
        ) : (
          <NotFoundPage onNavigate={navigateTo} />
        );
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onNavigate={navigateTo}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onNavigate={navigateTo}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'register':
        return <RegisterPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onNavigate={navigateTo}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={favorites.length}
      />
      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}