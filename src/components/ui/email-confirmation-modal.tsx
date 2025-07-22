import React from 'react'
import { Modal } from './modal'
import { Mail, CheckCircle } from 'lucide-react'
import { Button } from './button'

interface EmailConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailConfirmationModal({ isOpen, onClose, email }: EmailConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Подтвердите email"
      className="max-w-md"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-silver-bright text-lg">Проверьте вашу почту</h3>
          <p className="text-silver-dim">
            Мы отправили письмо с подтверждением на адрес:
          </p>
          <p className="text-silver-accent font-medium">{email}</p>
        </div>

        <div className="bg-slate-dark rounded-lg p-4 space-y-3">
          <div className="flex items-center text-silver-dim text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Перейдите в свою почту
          </div>
          <div className="flex items-center text-silver-dim text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Найдите письмо от Savra Jewelry
          </div>
          <div className="flex items-center text-silver-dim text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Нажмите на ссылку подтверждения
          </div>
        </div>

        <div className="text-silver-shadow text-sm">
          <p>Не получили письмо? Проверьте папку "Спам" или попробуйте зарегистрироваться снова.</p>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
        >
          Понятно
        </Button>
      </div>
    </Modal>
  )
}