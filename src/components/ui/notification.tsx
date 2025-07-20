import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Button } from './button'

interface NotificationProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'info'
  title: string
  message: string
  autoClose?: boolean
  duration?: number
}

export function Notification({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  autoClose = true, 
  duration = 5000 
}: NotificationProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, autoClose, duration, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10'
      case 'error':
        return 'border-red-500/20 bg-red-500/10'
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`max-w-sm rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getBgColor()}`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <h4 className="text-silver-bright font-medium">{title}</h4>
            <p className="text-silver-dim text-sm mt-1">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-slate-dark text-silver-dim hover:text-silver-accent-light"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}