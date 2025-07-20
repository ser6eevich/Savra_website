import React from 'react'
import { Modal } from '../ui/modal'
import { ImageWithFallback } from '../ImageWithFallback'
import type { Product } from '../../types'

interface ProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  products: Product[]
  onSelectProduct: (product: Product) => void
}

export function ProductSelectionModal({
  isOpen,
  onClose,
  title,
  products,
  onSelectProduct
}: ProductSelectionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-4xl"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="cursor-pointer rounded-lg border-2 border-slate-dark hover:border-silver-accent-light transition-all duration-300"
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="text-sm text-silver-bright mb-1">{product.name}</h4>
              <p className="text-xs text-silver-dim mb-2">{product.description}</p>
              <p className="text-chrome text-sm">₽{product.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}