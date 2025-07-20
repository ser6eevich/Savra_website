import React from 'react';
import { Button } from './ui/button';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pure-black">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl mb-4 text-silver-accent">404</h1>
          <h2 className="mb-4 text-silver-bright">Страница не найдена</h2>
          <p className="text-silver-dim mb-8">
            Запрашиваемая страница не существует или была перемещена. 
            Возможно, вы перешли по неверной ссылке.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('home')}
            className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
          >
            На главную
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('catalog')}
            className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
          >
            Каталог
          </Button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-silver-shadow text-sm">
            Если проблема повторяется, пожалуйста, свяжитесь с нами
          </p>
        </div>
      </div>
    </div>
  );
}