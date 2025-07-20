import React from 'react';
import { Instagram, Youtube, Send, MessageCircle, Clock, Truck, Hammer } from 'lucide-react';
import { Button } from './ui/button';

export function AboutPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="mb-6 text-silver-bright">О нас</h1>
          <p className="text-xl text-silver-dim max-w-3xl mx-auto leading-relaxed">
            Savra Jewelry — это история о красоте несовершенства, вдохновленная природными процессами выветривания и эрозии. 
            Мы создаем уникальные серебряные украшения, которые отражают философию ваби-саби.
          </p>
        </div>

        {/* Philosophy Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-center text-silver-bright">Наша Философия</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="mb-4 text-silver-muted">Красота Времени</h3>
                <p className="text-silver-dim leading-relaxed mb-6">
                  Каждое изделие Savra рассказывает историю времени. Мы черпаем вдохновение из того, 
                  как природа формирует камень — через эрозию, выветривание и естественные процессы старения.
                </p>
                <p className="text-silver-dim leading-relaxed">
                  Наши украшения созданы, чтобы отражать эту естественную красоту несовершенства, 
                  где каждая трещина, каждая неровность имеет свою историю и значение.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-silver-muted">Мастерство</h3>
                <p className="text-silver-dim leading-relaxed mb-6">
                  Используя только высококачественное серебро 925 пробы, мы создаем изделия, 
                  которые будут служить годами, приобретая со временем уникальную патину.
                </p>
                <p className="text-silver-dim leading-relaxed">
                  Каждое кольцо изготавливается вручную с особым вниманием к деталям, 
                  текстурам и финишной обработке, которая подчеркивает природную эстетику.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Information */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-12 text-center text-silver-bright">Информация о Сервисе</h2>
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Working Hours */}
              <div className="bg-graphite p-6 rounded-lg border border-slate-dark">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-silver-accent mr-3" />
                  <h3 className="text-silver-bright">Режим Работы</h3>
                </div>
                <div className="space-y-2 text-silver-dim">
                  <p>Понедельник - Пятница: 10:00 - 19:00</p>
                  <p>Суббота: 11:00 - 18:00</p>
                  <p>Воскресенье: 12:00 - 17:00</p>
                  <p className="text-silver-shadow text-sm mt-4">
                    Онлайн-заказы принимаются круглосуточно
                  </p>
                </div>
              </div>

              {/* Production Time */}
              <div className="bg-graphite p-6 rounded-lg border border-slate-dark">
                <div className="flex items-center mb-4">
                  <Hammer className="w-6 h-6 text-silver-accent mr-3" />
                  <h3 className="text-silver-bright">Время Изготовления</h3>
                </div>
                <div className="space-y-2 text-silver-dim">
                  <p>Кольца в наличии: 1-2 дня</p>
                  <p>Изготовление на заказ: 7-14 дней</p>
                  <p>Персонализация: 3-5 дней</p>
                  <p className="text-silver-shadow text-sm mt-4">
                    Точные сроки уточняются при заказе
                  </p>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-graphite p-6 rounded-lg border border-slate-dark">
                <div className="flex items-center mb-4">
                  <Truck className="w-6 h-6 text-silver-accent mr-3" />
                  <h3 className="text-silver-bright">Доставка</h3>
                </div>
                <div className="space-y-2 text-silver-dim">
                  <p>По Москве: 1-2 дня (бесплатно от ₽5000)</p>
                  <p>По России: 3-7 дней (от ₽300)</p>
                  <p>Экспресс-доставка: в день заказа</p>
                  <p className="text-silver-shadow text-sm mt-4">
                    Самовывоз из мастерской доступен
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8 text-silver-bright">Следите за Нами</h2>
            <p className="text-silver-dim mb-8 max-w-2xl mx-auto">
              Следите за процессом создания украшений, новыми коллекциями и вдохновением 
              в наших социальных сетях
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              <Button
                variant="outline"
                className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright p-4 rounded-full transition-all duration-300"
              >
                <Instagram className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright p-4 rounded-full transition-all duration-300"
              >
                <Youtube className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright p-4 rounded-full transition-all duration-300"
              >
                <Send className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright p-4 rounded-full transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-silver-shadow">
              <div>
                <p className="mb-1">@savra_jewelry</p>
                <p>Instagram</p>
              </div>
              <div>
                <p className="mb-1">Savra Jewelry</p>
                <p>YouTube</p>
              </div>
              <div>
                <p className="mb-1">@savra_jewelry</p>
                <p>Telegram</p>
              </div>
              <div>
                <p className="mb-1">+7 (999) 123-45-67</p>
                <p>WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6 text-silver-bright">Связаться с Нами</h2>
            <p className="text-silver-dim mb-8">
              Есть вопросы о наших изделиях или хотите обсудить индивидуальный заказ? 
              Мы всегда рады помочь вам найти идеальное украшение.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright px-8 py-3 tracking-wide transition-all duration-300">
                Написать нам
              </Button>
              <Button
                variant="outline"
                className="border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright px-8 py-3 tracking-wide transition-all duration-300"
              >
                Заказать звонок
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}