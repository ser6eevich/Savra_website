import React, { useRef } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Modal } from '../ui/modal'
import { Upload, Play, X } from 'lucide-react'
import type { Product } from '../../types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  editingProduct: Product | null
  productForm: {
    name: string
    description: string
    detailedDescription: string
    price: number
    images: string[]
    video: string
    category: string
    collection: string
    article: string
    material: string
    type: 'classic' | 'textured' | 'mens'
    sizes: string[]
  }
  setProductForm: React.Dispatch<React.SetStateAction<any>>
  handleFileUpload: (files: FileList | null, type: 'image' | 'video') => void
  removeImage: (index: number) => void
}

export function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  productForm,
  setProductForm,
  handleFileUpload,
  removeImage
}: ProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? 'Редактировать товар' : 'Добавить товар'}
      className="max-w-5xl max-h-[85vh]"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              className="border-slate-dark bg-slate-dark text-silver-muted"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="border-slate-dark bg-slate-dark text-silver-muted"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Краткое описание</Label>
          <Input
            id="description"
            value={productForm.description}
            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
            className="border-slate-dark bg-slate-dark text-silver-muted"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <Label>Фотографии товара (до 10 штук)</Label>
          <div 
            className="border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-silver-accent transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-silver-shadow mx-auto mb-2" />
            <p className="text-silver-dim">Перетащите фото или нажмите для выбора</p>
            <p className="text-silver-shadow text-sm">PNG, JPG до 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files, 'image')}
            className="hidden"
          />
          
          {/* Image Preview */}
          {productForm.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {productForm.images.map((image, index) => (
                <div key={index} className="relative aspect-square bg-slate-dark rounded overflow-hidden">
                  <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 p-0 bg-destructive hover:bg-destructive/80"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div className="space-y-4">
          <Label>Видео товара (1 видео)</Label>
          <div 
            className="border-2 border-dashed border-slate-dark rounded-lg p-6 text-center hover:border-silver-accent transition-colors cursor-pointer"
            onClick={() => videoInputRef.current?.click()}
          >
            <Play className="w-8 h-8 text-silver-shadow mx-auto mb-2" />
            <p className="text-silver-dim">Перетащите видео или нажмите для выбора</p>
            <p className="text-silver-shadow text-sm">MP4, MOV до 50MB</p>
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileUpload(e.target.files, 'video')}
            className="hidden"
          />
          
          {/* Video Preview */}
          {productForm.video && (
            <div className="relative aspect-video bg-slate-dark rounded overflow-hidden">
              <video src={productForm.video} className="w-full h-full object-cover" controls />
              <Button
                type="button"
                onClick={() => setProductForm(prev => ({ ...prev, video: '' }))}
                className="absolute top-2 right-2 w-8 h-8 p-0 bg-destructive hover:bg-destructive/80"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="collection">Коллекция</Label>
            <Input
              id="collection"
              value={productForm.collection}
              onChange={(e) => setProductForm(prev => ({ ...prev, collection: e.target.value }))}
              className="border-slate-dark bg-slate-dark text-silver-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="article">Артикул</Label>
            <Input
              id="article"
              value={productForm.article}
              onChange={(e) => setProductForm(prev => ({ ...prev, article: e.target.value }))}
              className="border-slate-dark bg-slate-dark text-silver-muted"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-silver-accent hover:bg-silver-accent-light text-silver-bright"
        >
          {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
        </Button>
      </form>
    </Modal>
  )
}