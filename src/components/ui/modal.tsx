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
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-pure-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-graphite rounded-lg border border-slate-dark shadow-2xl max-h-[90vh] overflow-hidden",
        "w-full max-w-4xl transform transition-all duration-300 ease-out",
        "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4",
        className
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-dark flex-shrink-0">
            <h2 className="text-xl text-silver-bright">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-slate-dark text-silver-dim hover:text-silver-accent-light"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  )
}