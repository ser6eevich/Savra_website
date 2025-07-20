import React from 'react';
import { Heart, ShoppingBag, Menu } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount: number;
  favoritesCount: number;
}

export function Header({ currentPage, onNavigate, cartItemCount, favoritesCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-graphite">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center hover:opacity-80 transition-opacity group"
          >
            <span className="text-xl tracking-wider text-silver-bright group-hover:text-chrome transition-colors">SAVRA</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`tracking-wide transition-colors hover:text-silver-accent-light ${
                currentPage === 'home' ? 'text-chrome' : 'text-silver-dim'
              }`}
            >
              ГЛАВНАЯ
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`tracking-wide transition-colors hover:text-silver-accent-light ${
                currentPage === 'catalog' ? 'text-chrome' : 'text-silver-dim'
              }`}
            >
              КАТАЛОГ
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`tracking-wide transition-colors hover:text-silver-accent-light ${
                currentPage === 'about' ? 'text-chrome' : 'text-silver-dim'
              }`}
            >
              О НАС
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('favorites')}
              className="relative p-2 hover:bg-graphite text-silver-dim hover:text-silver-accent-light"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-silver-accent text-silver-bright text-xs rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('cart')}
              className="relative p-2 hover:bg-graphite text-silver-dim hover:text-silver-accent-light"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-silver-accent text-silver-bright text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('register')}
              className="hidden sm:inline-flex border-steel-dark text-silver-dim hover:bg-silver-accent hover:text-silver-bright transition-colors"
            >
              РЕГИСТРАЦИЯ
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-silver-dim hover:text-silver-accent-light"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}