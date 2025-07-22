import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Modal } from './ui/modal'
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, AlertCircle } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  onRegister: (userData: any) => void
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError('')
    
    if (!isLoginMode && !agreedToTerms) {
      setError('Необходимо согласиться с обработкой персональных данных')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (isLoginMode) {
        await onLogin(formData.email, formData.password)
      } else {
        await onRegister(formData)
      }
      // Модальное окно закроется автоматически в родительском компоненте
    } catch (error) {
      setIsLoading(false)
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Неверный email или пароль. Проверьте данные или зарегистрируйтесь.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Подтвердите email адрес, проверив почту.')
        } else if (error.message.includes('User already registered')) {
          setError('Пользователь с таким email уже существует.')
        } else {
          setError(error.message)
        }
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('') // Очищаем ошибку при изменении данных
  }

  const fillTestCredentials = () => {
    setFormData({
      email: 'test@savra.com',
      password: 'test123456',
      firstName: 'Тест',
      lastName: 'Пользователь',
      phone: '+7 (999) 123-45-67'
    })
    setError('')
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isLoginMode ? 'Вход в аккаунт' : 'Создать аккаунт'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-silver-dim">
            {isLoginMode ? 'Нет аккаунта?' : 'Есть аккаунт?'}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fillTestCredentials}
            className="text-xs text-silver-accent hover:text-chrome"
          >
            Заполнить тестовые данные
          </Button>
        </div>

        {!isLoginMode && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-silver-dim">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow" />
                <Input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="pl-10 border-slate-dark bg-slate-dark text-silver-muted"
                  placeholder="Елена"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-silver-dim">Фамилия</Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-slate-dark bg-slate-dark text-silver-muted"
                placeholder="Савра"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-silver-dim">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow" />
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 border-slate-dark bg-slate-dark text-silver-muted"
              placeholder="elena@example.com"
            />
          </div>
        </div>

        {!isLoginMode && (
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-silver-dim">Телефон</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow" />
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 border-slate-dark bg-slate-dark text-silver-muted"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-silver-dim">Пароль</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-silver-shadow" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 border-slate-dark bg-slate-dark text-silver-muted"
              placeholder="Введите пароль"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-silver-shadow hover:text-silver-accent-light"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {!isLoginMode && (
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={setAgreedToTerms}
              className="mt-1 border-slate-dark data-[state=checked]:bg-silver-accent data-[state=checked]:border-silver-accent"
            />
            <Label htmlFor="terms" className="text-silver-dim text-sm leading-relaxed cursor-pointer">
              Я согласен(на) с{' '}
              <button type="button" className="text-silver-accent hover:text-chrome underline">
                обработкой персональных данных
              </button>
              {' '}и{' '}
              <button type="button" className="text-silver-accent hover:text-chrome underline">
                политикой конфиденциальности
              </button>
            </Label>
          </div>
        )}

        <Button
          type="submit"
          disabled={(!isLoginMode && !agreedToTerms) || isLoading}
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isLoginMode ? 'Вход...' : 'Создание...'}
            </>
          ) : (
            isLoginMode ? 'Войти' : 'Создать аккаунт'
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-sm text-silver-accent hover:text-chrome transition-colors"
          >
            {isLoginMode ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </form>
    </Modal>
  )
}