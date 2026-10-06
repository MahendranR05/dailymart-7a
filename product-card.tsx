'use client'

import { Heart, Minus, Plus, Star } from 'lucide-react'
import { money, type Product } from '@/lib/catalog'
import { cn } from '@/lib/utils'

export function ProductCard({ product, quantity, saved, onAdd, onRemove, onSave, onView }: { product: Product; quantity: number; saved: boolean; onAdd: () => void; onRemove: () => void; onSave: () => void; onView: () => void }) {
  return <article className="product-card">
    <div className="product-photo">
      <button className="product-photo-link" onClick={onView} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" width={300} height={240} /></button>
      <span className="discount">{Math.round((1 - product.price / product.original) * 100)}% OFF</span>
      <button className={cn('save-button', saved && 'is-saved')} onClick={onSave} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={saved}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="product-info">
      <div className="product-rating"><Star size={11} fill="currentColor" /> {product.rating}<span>·</span><span>{product.category === 'Electronics' ? 'Top rated' : 'Everyday favourite'}</span></div>
      <button className="product-title" onClick={onView}>{product.name}</button>
      <p className="product-unit">{product.unit}</p>
      <div className="product-bottom"><div className="price">{money(product.price)} <s>{money(product.original)}</s></div>
        {quantity ? <div className="quantity-control"><button onClick={onRemove} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button><span>{quantity}</span><button onClick={onAdd} disabled={quantity >= 10} aria-label={`Add one ${product.name}`}><Plus size={13} /></button></div> : <button className="add-button" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>ADD <Plus size={14} /></button>}
      </div>
    </div>
  </article>
}
