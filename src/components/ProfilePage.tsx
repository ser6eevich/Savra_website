import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ImageWithFallback } from './ImageWithFallback'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Heart, 
  Package, 
  Edit,
  Camera,
  Save,
  X
} from 'lucide-react'
import type { User as UserType, Order, Product } from '../types'

interface ProfilePageProps {
  user: UserType
  orders: Order[]
  favoriteProducts: Product[]
  onUpdateUser: (userData: Partial<UserType>) => void
  onNavigate: (page: string, productId?: string) => void
}

export function ProfilePage({ user, orders, favoriteProducts, onUpdateUser, onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    dateOfBirth: user.dateOfBirth || ''
  })

  const handleSaveProfile = () => {
    onUpdateUser(editForm)
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Загружаем файл в Supabase Storage
      const uploadAvatar = async () => {
        try {
          const { supabase } = await import('../lib/supabase')
          
          // Создаем уникальное имя файла
          const fileExt = file.name.split('.').pop()
          const fileName = `${user.id}/avatar.${fileExt}`
          
          // Загружаем файл
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true })
          
          if (uploadError) throw uploadError
          
          // Получаем публичный URL
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)
          
          // Обновляем профиль пользователя
          onUpdateUser({ avatar: data.publicUrl })
        } catch (error) {
          console.error('Error uploading avatar:', error)
          alert('Ошибка загрузки аватара')
        }
      }
      
      uploadAvatar()
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'processing': return 'bg-blue-500/20 text-blue-400'
      case 'shipped': return 'bg-purple-500/20 text-purple-400'
      case 'delivered': return 'bg-green-500/20 text-green-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Ожидает'
      case 'processing': return 'В обработке'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      case 'cancelled': return 'Отменен'
      default: return status
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-graphite rounded-lg p-6 border border-slate-dark mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-dark rounded-full overflow-hidden">
                  {user.avatar ? (
                    <ImageWithFallback
                      src={user.avatar}
                      alt="Аватар"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-silver-shadow" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-6 h-6 bg-silver-accent rounded-full flex items-center justify-center cursor-pointer hover:bg-silver-accent-light transition-colors">
                  <Camera className="w-3 h-3 text-silver-bright" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <h1 className="text-silver-bright text-2xl mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-silver-dim">{user.email}</p>
                <p className="text-silver-shadow text-sm">
                  Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-dark rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                activeTab === 'profile'
                  ? 'bg-silver-accent text-silver-bright'
                  : 'text-silver-dim hover:text-silver-accent-light'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              Профиль
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                activeTab === 'orders'
                  ? 'bg-silver-accent text-silver-bright'
                  : 'text-silver-dim hover:text-silver-accent-light'
              }`}
            >
              <Package className="w-4 h-4 mr-2" />
              Заказы ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
                activeTab === 'favorites'
                  ? 'bg-silver-accent text-silver-bright'
                  : 'text-silver-dim hover:text-silver-accent-light'
              }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Избранное ({favoriteProducts.length})
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-graphite rounded-lg p-6 border border-slate-dark">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-silver-bright">Личная информация</h2>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="border-steel-dark text-silver-dim hover:bg-steel-dark"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          phone: user.phone || '',
                          dateOfBirth: user.dateOfBirth || ''
                        })
                      }}
                      variant="outline"
                      className="border-steel-dark text-silver-dim hover:bg-steel-dark"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Отмена
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-silver-dim flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Имя
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                      />
                    ) : (
                      <p className="text-silver-muted">{user.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-silver-dim flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Фамилия
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                      />
                    ) : (
                      <p className="text-silver-muted">{user.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-silver-dim flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                      />
                    ) : (
                      <p className="text-silver-muted">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-silver-dim flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Телефон
                    </Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                        placeholder="+7 (999) 123-45-67"
                      />
                    ) : (
                      <p className="text-silver-muted">{user.phone || 'Не указан'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-silver-dim flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Дата рождения
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editForm.dateOfBirth}
                        onChange={(e) => setEditForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        className="border-slate-dark bg-slate-dark text-silver-muted"
                      />
                    ) : (
                      <p className="text-silver-muted">
                        {user.dateOfBirth 
                          ? new Date(user.dateOfBirth).toLocaleDateString('ru-RU')
                          : 'Не указана'
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-graphite rounded-lg p-12 border border-slate-dark text-center">
                  <Package className="w-16 h-16 text-silver-shadow mx-auto mb-4" />
                  <h3 className="text-silver-muted mb-2">Пока нет заказов</h3>
                  <p className="text-silver-dim mb-6">Начните с изучения нашего каталога</p>
                  <Button
                    onClick={() => onNavigate('catalog')}
                    className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
                  >
                    Перейти в каталог
                  </Button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-graphite rounded-lg p-6 border border-slate-dark">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-silver-bright mb-1">Заказ #{order.id}</h3>
                        <p className="text-silver-dim text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-silver-dim">
                            {item.name} {item.size && `(размер ${item.size})`} × {item.quantity}
                          </span>
                          <span className="text-silver-muted">₽{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-dark">
                      <span className="text-silver-bright">Итого:</span>
                      <span className="text-chrome text-lg">₽{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              {favoriteProducts.length === 0 ? (
                <div className="bg-graphite rounded-lg p-12 border border-slate-dark text-center">
                  <Heart className="w-16 h-16 text-silver-shadow mx-auto mb-4" />
                  <h3 className="text-silver-muted mb-2">Нет избранных товаров</h3>
                  <p className="text-silver-dim mb-6">Добавляйте понравившиеся изделия в избранное</p>
                  <Button
                    onClick={() => onNavigate('catalog')}
                    className="bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
                  >
                    Перейти в каталог
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map((product) => (
                    <div key={product.id} className="bg-graphite rounded-lg border border-slate-dark overflow-hidden">
                      <div className="aspect-square cursor-pointer" onClick={() => onNavigate('product', product.id)}>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-silver-bright mb-2">{product.name}</h3>
                        <p className="text-silver-dim text-sm mb-2">{product.description}</p>
                        <p className="text-chrome">₽{product.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}