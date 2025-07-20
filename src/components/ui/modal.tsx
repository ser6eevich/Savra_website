import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function Modal({ isOpen, onClose, children, title, className }: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = '0'
      document.body.style.left = '0'
      document.body.style.right = '0'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Создаем портал прямо в body */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        {/* Backdrop */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div 
          style={{
            position: 'relative',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px solid #2a2a2a',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '1152px',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column'
          }}
          className={cn("transform transition-all duration-300 ease-out", className)}
        >
          {/* Header */}
          {title && (
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                borderBottom: '1px solid #2a2a2a',
                flexShrink: 0
              }}
            >
              <h2 style={{ fontSize: '20px', color: '#f0f2f4', margin: 0 }}>{title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                style={{
                  padding: '8px',
                  color: '#c9cccf',
                  backgroundColor: 'transparent'
                }}
                className="hover:bg-slate-dark hover:text-silver-accent-light"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div style={{ padding: '24px', flex: 1 }}>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}