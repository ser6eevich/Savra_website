import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Modal } from '../ui/modal'

interface PromoCodeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  promoForm: {
    code: string
    discount: number
    isActive: boolean
    maxUsage?: number
  }
  setPromoForm: React.Dispatch<React.SetStateAction<any>>
}

export function PromoCodeModal({
  isOpen,
  onClose,
  onSubmit,
  promoForm,
  setPromoForm
}: PromoCodeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать промокод"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Код промокода</Label>
          <Input
            id="code"
            value={promoForm.code}
            onChange={(e) => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
            className="border-slate-dark bg-slate-dark text-silver-muted"
            placeholder="SAVRA10"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Размер скидки (%)</Label>
          <Input
            id="discount"
            type="number"
            min="1"
            max="100"
            value={promoForm.discount}
            onChange={(e) => setPromoForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
            className="border-slate-dark bg-slate-dark text-silver-muted"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsage">Максимальное количество использований (необязательно)</Label>
          <Input
            id="maxUsage"
            type="number"
            min="1"
            value={promoForm.maxUsage || ''}
            onChange={(e) => setPromoForm(prev => ({ 
              ...prev, 
              maxUsage: e.target.value ? Number(e.target.value) : undefined 
            }))}
            className="border-slate-dark bg-slate-dark text-silver-muted"
            placeholder="Без ограничений"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
        >
          Создать промокод
        </Button>
      </form>
    </Modal>
  )
}