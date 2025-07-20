import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Modal } from './ui/modal'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  onRegister: (userData: any) => void
}

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoginMode) {
      onLogin(formData.email, formData.password)
    } else {
      onRegister(formData)
    }
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={isLoginMode ? 'Вход в аккаунт' : 'Создать аккаунт'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button
          type="submit"
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright py-3 transition-all duration-300"
        >
          {isLoginMode ? 'Войти' : 'Создать аккаунт'}
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