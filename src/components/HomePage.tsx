import React from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80"
            alt="Серебряные украшения Savra"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-pure-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/30 to-charcoal/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="mb-6 text-silver-bright">
            Выветренная Красота
          </h1>
          <p className="text-xl text-silver-dim mb-8 max-w-2xl mx-auto leading-relaxed">
            Каждое изделие рассказывает историю времени, эрозии и природных преобразований. 
            Серебряные украшения, вдохновленные суровой красотой выветренного камня и древних трещин.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('catalog')}
              className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
            >
              ИЗУЧИТЬ КОЛЛЕКЦИЮ
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('about')}
              className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
            >
              НАША ИСТОРИЯ
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-charcoal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-silver-bright">Избранные Изделия</h2>
            <p className="text-silver-dim max-w-2xl mx-auto">
              Украшения ручной работы из серебра, которые передают суть природного выветривания и времени.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="group cursor-pointer" onClick={() => onNavigate('catalog')}>
                <div className="aspect-square bg-graphite rounded-lg overflow-hidden mb-4 border border-slate-dark">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80`}
                    alt={`Избранное изделие ${index}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-2 text-silver-bright">Кольцо Трещин {index}</h3>
                <p className="text-silver-dim mb-2">Серебро с окисленной патиной</p>
                <p className="text-chrome tracking-wide">₽8,500</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-graphite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8 text-silver-bright">Красота в Несовершенстве</h2>
            <p className="text-lg text-silver-dim leading-relaxed mb-8">
              Украшения Savra прославляют эстетику ваби-саби — поиск красоты в несовершенстве, 
              непостоянстве и незавершенности. Наши изделия вдохновлены тем, как время и стихии 
              формируют камень, создавая уникальные текстуры и узоры, которые рассказывают истории выносливости.
            </p>
            <p className="text-silver-dim leading-relaxed">
              Каждый кусочек серебра тщательно обрабатывается, чтобы запечатлеть эти природные явления, 
              с текстурами, напоминающими скалы, речные камни и древние геологические образования.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-pure-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="mb-4 text-silver-bright">Оставайтесь на Связи</h3>
          <p className="text-silver-dim mb-8 max-w-xl mx-auto">
            Будьте первыми, кто узнает о новых изделиях и нашем ремесле.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Введите ваш email"
              className="flex-1 px-4 py-3 bg-graphite text-silver-muted border border-slate-dark rounded-l-md focus:outline-none focus:ring-2 focus:ring-silver-accent focus:border-silver-accent"
            />
            <Button className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-6 py-3 rounded-r-md rounded-l-none transition-all duration-300">
              ПОДПИСАТЬСЯ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}