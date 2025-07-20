import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Eye, EyeOff, Calendar, Phone, Shield } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    agreeToTerms: false,
    subscribeNewsletter: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendCode = () => {
    if (formData.phone.length >= 10) {
      setCodeSent(true);
      // Simulate API call to send verification code
      console.log('Sending verification code to:', formData.phone);
    }
  };

  const handleVerifyCode = () => {
    if (formData.verificationCode.length === 6) {
      setIsVerifyingCode(true);
      // Simulate API verification
      setTimeout(() => {
        setPhoneVerified(true);
        setIsVerifyingCode(false);
        console.log('Phone verified successfully');
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration data:', formData);
    // For demo purposes, navigate to home
    onNavigate('home');
  };

  const isFormValid = formData.agreeToTerms && phoneVerified;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-graphite mb-4 text-silver-dim hover:text-silver-accent-light"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-center text-silver-bright">Создать Аккаунт</h1>
            <p className="text-center text-silver-dim mt-2">
              Присоединяйтесь к сообществу Savra и первыми узнавайте о новых изделиях.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-graphite rounded-lg p-8 border border-slate-dark">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-silver-dim">Имя</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow"
                    placeholder="Елена"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-silver-dim">Фамилия</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow"
                    placeholder="Савра"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-silver-dim">Email адрес</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow"
                  placeholder="elena@example.com"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-silver-dim flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Номер телефона
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow"
                    placeholder="+7 (999) 123-45-67"
                    disabled={phoneVerified}
                  />
                  {!phoneVerified && (
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={formData.phone.length < 10 || codeSent}
                      variant="outline"
                      className="border-slate-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright disabled:opacity-50"
                    >
                      {codeSent ? 'Отправлен' : 'Код'}
                    </Button>
                  )}
                  {phoneVerified && (
                    <div className="flex items-center px-3 py-2 bg-silver-accent rounded-md">
                      <Shield className="w-4 h-4 text-silver-bright" />
                    </div>
                  )}
                </div>
              </div>

              {/* Verification Code */}
              {codeSent && !phoneVerified && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-silver-dim">
                    Код подтверждения
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      required
                      maxLength={6}
                      value={formData.verificationCode}
                      onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                      className="flex-1 border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow text-center tracking-widest"
                      placeholder="123456"
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={formData.verificationCode.length !== 6 || isVerifyingCode}
                      variant="outline"
                      className="border-slate-dark text-silver-dim hover:bg-steel-dark hover:text-silver-bright disabled:opacity-50"
                    >
                      {isVerifyingCode ? 'Проверка...' : 'Проверить'}
                    </Button>
                  </div>
                  <p className="text-xs text-silver-shadow">
                    Введите 6-значный код, отправленный на ваш телефон
                  </p>
                </div>
              )}

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-silver-dim">Дата рождения</Label>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-silver-dim">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow pr-10"
                    placeholder="Введите пароль"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-silver-shadow hover:text-silver-accent-light"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-silver-dim">Подтвердите пароль</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="border-slate-dark focus:border-silver-accent bg-slate-dark text-silver-muted placeholder:text-silver-shadow pr-10"
                    placeholder="Подтвердите пароль"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-silver-shadow hover:text-silver-accent-light"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className="mt-1 border-slate-dark data-[state=checked]:bg-silver-accent data-[state=checked]:border-silver-accent"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-silver-dim leading-relaxed">
                    Я соглашаюсь с{' '}
                    <button type="button" className="text-silver-accent hover:text-chrome hover:underline transition-colors">
                      Условиями использования
                    </button>{' '}
                    и{' '}
                    <button type="button" className="text-silver-accent hover:text-chrome hover:underline transition-colors">
                      Политикой конфиденциальности
                    </button>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', checked as boolean)}
                    className="mt-1 border-slate-dark data-[state=checked]:bg-silver-accent data-[state=checked]:border-silver-accent"
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm text-silver-dim leading-relaxed">
                    Хочу получать новости о новых изделиях и эксклюзивных предложениях
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Создать аккаунт
              </Button>

              {/* Phone Verification Status */}
              {!phoneVerified && formData.phone && (
                <div className="text-center text-sm text-silver-shadow">
                  Для завершения регистрации необходимо подтвердить номер телефона
                </div>
              )}
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-silver-shadow">
                Уже есть аккаунт?{' '}
                <button 
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="text-silver-accent hover:text-chrome hover:underline transition-colors"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <h3 className="mb-4 text-silver-dim">Преимущества участника</h3>
            <div className="space-y-2 text-sm text-silver-shadow">
              <p>• Ранний доступ к новым коллекциям</p>
              <p>• Эксклюзивные изделия только для участников</p>
              <p>• Персональные рекомендации</p>
              <p>• Бесплатная доставка на все заказы</p>
              <p>• Приоритетная поддержка</p>
              <p>• Защищенная двухфакторная аутентификация</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}