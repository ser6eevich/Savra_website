import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { EmailConfirmationModal } from './ui/email-confirmation-modal'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Modal } from './ui/modal'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (!isLoginMode && !agreedToTerms) {
      setError('Необходимо согласиться с обработкой персональных данных')
      setLoading(false)
      return
    }
    
    try {
      if (isLoginMode) {
        const { error } = await signIn(formData.email, formData.password)
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Пожалуйста, подтвердите ваш email перед входом')
          } else if (error.message.includes('Invalid login credentials')) {
            setError('Неверный email или пароль')
          } else {
            setError(error.message)
          }
        } else {
          onClose()
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('Пользователь с таким email уже зарегистрирован')
          } else {
            setError(error.message)
          }
        } else {
          setShowEmailConfirmation(true)
        }
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEmailConfirmationClose = () => {
    setShowEmailConfirmation(false)
    onClose()
  }

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        title={isLoginMode ? 'Вход в аккаунт' : 'Создать аккаунт'}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

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
          disabled={(!isLoginMode && !agreedToTerms) || loading}
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Создать аккаунт')}
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

      <EmailConfirmationModal
        isOpen={showEmailConfirmation}
        onClose={handleEmailConfirmationClose}
        email={formData.email}
      />
    </>
  )
}