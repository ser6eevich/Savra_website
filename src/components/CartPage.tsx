import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Minus, Plus, Trash2, Tag, CreditCard, Calendar } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Separator } from './ui/separator';
import { Notification } from './ui/notification';
import type { CartItem } from '../types';

interface CartPageProps {
  cartItems: CartItem[];
  onNavigate: (page: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  promoCodes: PromoCode[];
}

// Demo cart item for display
const demoCartItem: CartItem = {
  id: '1',
  name: 'Кольцо Эрозии',
  price: 10250,
  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center&auto=format&q=80',
  quantity: 1,
  size: '18'
};

export function CartPage({ cartItems, onNavigate, onUpdateQuantity, onRemoveItem, onClearCart, promoCodes }: CartPageProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showOrderNotification, setShowOrderNotification] = useState(false);

  // Use demo item if cart is empty for display purposes
  const displayItems = cartItems.length > 0 ? cartItems : [demoCartItem];

  const subtotal = displayItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = promoApplied ? promoDiscount : 0;
  const delivery = subtotal > 5000 ? 0 : 500;
  const total = subtotal - discount + delivery;

  const handleApplyPromo = () => {
    const validPromo = promoCodes.find(promo => 
      promo.code.toLowerCase() === promoCode.toLowerCase() && promo.isActive
    );
    
    if (validPromo) {
      setPromoApplied(true);
      setPromoDiscount(Math.floor(subtotal * (validPromo.discount / 100)));
    } else {
      alert('Промокод не найден или неактивен');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoCode('');
  };

  const handleOrderSubmit = () => {
    setShowOrderNotification(true);
    // Здесь будет логика отправки заказа в CRM
    // Можно различать заказы по типу: catalog или constructor
  };

  return (
    <div className="min-h-screen py-8">
      <Notification
        isOpen={showOrderNotification}
        onClose={() => setShowOrderNotification(false)}
        type="success"
        title="Заказ принят!"
        message="Спасибо за заказ! Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей."
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('catalog')}
            className="mr-4 p-2 hover:bg-graphite text-silver-dim hover:text-silver-accent-light"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Продолжить покупки
          </Button>
          <h1 className="text-silver-bright flex-1">Корзина</h1>
          {displayItems.length > 0 && cartItems.length > 0 && (
            <Button
              variant="outline"
              onClick={onClearCart}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              Очистить корзину
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {displayItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="bg-graphite rounded-lg p-6 border border-slate-dark">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-dark rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-silver-bright">{item.name}</h3>
                        {item.size && <p className="text-silver-dim text-sm">Размер: {item.size}</p>}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(`${item.id}-${item.size}`)}
                        className="p-1 text-silver-dim hover:text-destructive hover:bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0 border-steel-dark hover:bg-steel-dark"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-silver-muted">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0 border-steel-dark hover:bg-steel-dark"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="text-chrome">₽{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-graphite rounded-lg p-6 border border-slate-dark h-fit">
            <h2 className="text-silver-bright mb-6">Итого</h2>
            
            {/* Promo Code */}
            <div className="mb-6">
              <h3 className="text-silver-muted mb-3">Промокод</h3>
              {!promoApplied ? (
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow" />
                    <Input
                      placeholder="Введите промокод"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-10 border-slate-dark bg-slate-dark text-silver-muted"
                    />
                  </div>
                  <Button
                    onClick={handleApplyPromo}
                    variant="outline"
                    className="border-steel-dark hover:bg-steel-dark"
                  >
                    Применить
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-steel-dark p-3 rounded border border-silver-accent">
                  <span className="text-silver-bright">Промокод SAVRA10</span>
                  <Button
                    onClick={handleRemovePromo}
                    variant="ghost"
                    size="sm"
                    className="text-silver-dim hover:text-destructive p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-silver-dim">Подытог:</span>
                <span className="text-silver-muted">₽{subtotal.toLocaleString()}</span>
              </div>
              
              {promoApplied && (
                <div className="flex justify-between text-silver-accent">
                  <span>Скидка:</span>
                  <span>-₽{discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-silver-dim">Доставка:</span>
                <span className="text-silver-muted">
                  {delivery === 0 ? 'Бесплатно' : `₽${delivery.toLocaleString()}`}
                </span>
              </div>
              
              <Separator className="bg-slate-dark" />
              
              <div className="flex justify-between">
                <span className="text-silver-bright">Итого:</span>
                <span className="text-chrome">₽{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <Button
                onClick={handleOrderSubmit}
                className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 tracking-wide transition-all duration-300"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Оформить заказ
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-steel-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright py-3 tracking-wide transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Купить в рассрочку
              </Button>
            </div>

            {/* Installment Info */}
            <div className="mt-4 p-3 bg-slate-dark rounded text-sm text-silver-dim">
              <p className="mb-1">Рассрочка 0-0-12:</p>
              <p>₽{Math.floor(total / 12).toLocaleString()} × 12 месяцев</p>
              <p className="text-silver-shadow text-xs mt-1">Без переплат и скрытых комиссий</p>
            </div>

            {/* Delivery Info */}
            <div className="mt-4 p-3 bg-slate-dark rounded text-sm text-silver-dim">
              <p className="mb-1">Доставка:</p>
              <p>По Москве: 1-2 дня</p>
              <p>По России: 3-7 дней</p>
              <p className="text-silver-shadow text-xs mt-1">
                Бесплатная доставка при заказе от ₽5,000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}