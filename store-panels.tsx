'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Dialog } from '@base-ui/react/dialog'
import { ArrowRight, Banknote, Check, CreditCard, Heart, House, Info, MapPin, Minus, Plus, ShoppingBag, Smartphone, Sparkles, X } from 'lucide-react'
import { products, money, type Address, type Cart, type Product } from '@/lib/catalog'
import { Button } from '@/components/ui/button'

export function StoreModal({ title, description, open, close, children, wide = false }: { title: string; description?: string; open: boolean; close: () => void; children: ReactNode; wide?: boolean }) {
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) close() }}><Dialog.Portal><Dialog.Backdrop className="modal-backdrop" /><Dialog.Popup className={`store-modal${wide ? ' wide' : ''}`}><div className="modal-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="icon-button" aria-label="Close dialog"><X size={20} /></Dialog.Close></div>{description && <Dialog.Description className="modal-description">{description}</Dialog.Description>}{children}</Dialog.Popup></Dialog.Portal></Dialog.Root>
}

export function AddressPanel({ addresses, selected, onSelect, onAdd }: { addresses: Address[]; selected: number; onSelect: (index: number) => void; onAdd: (address: Address) => void }) {
  const [adding, setAdding] = useState(false)
  return <div className="panel-stack"><div className="notice"><Info size={17} /><span>Preview addresses are only kept while this page is open. Delivery availability is not verified.</span></div>{addresses.map((address, i) => <button className={`address-card${selected === i ? ' active' : ''}`} key={`${address.street}-${i}`} onClick={() => onSelect(i)}><House size={20} /><span><strong>{address.label}</strong><span>{address.street}</span><span>{address.city} – {address.pin}</span></span>{selected === i && <Check size={18} />}</button>)}{!adding ? <button className="outline-button" onClick={() => setAdding(true)}><Plus size={16} /> Add a delivery address</button> : <form className="stack-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); onAdd({ label: String(data.get('label')), name: String(data.get('name')), street: String(data.get('street')), city: String(data.get('city')), pin: String(data.get('pin')) }); setAdding(false) }}><label>Address label<input name="label" placeholder="e.g. Home" maxLength={40} required /></label><label>Full name<input name="name" autoComplete="name" required maxLength={100} /></label><label>Street address<input name="street" autoComplete="street-address" required maxLength={200} /></label><div className="form-columns"><label>City<input name="city" autoComplete="address-level2" required maxLength={80} /></label><label>PIN code<input name="pin" inputMode="numeric" pattern="[1-9][0-9]{5}" title="Enter a valid 6-digit PIN code" autoComplete="postal-code" required /></label></div><Button type="submit">Use this address <Check data-icon="inline-end" /></Button><Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button></form>}</div>
}

export function CartPanel({ cart, update, address, editAddress, close }: { cart: Cart; update: (id: string, amount: number) => void; address: Address; editAddress: () => void; close: () => void }) {
  const [checkout, setCheckout] = useState(false)
  const [payment, setPayment] = useState('upi')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const entries = products.filter(product => cart[product.id] > 0)
  const subtotal = entries.reduce((total, product) => total + product.price * cart[product.id], 0)
  const saved = entries.reduce((total, product) => total + (product.original - product.price) * cart[product.id], 0)
  const loadRazorpay = () => new Promise<boolean>(resolve => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true
    script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script)
  })
  const pay = async () => {
    setBusy(true); setError(''); setSuccess('')
    try {
      if (payment === 'cod') {
        const response = await fetch('/api/orders/cod', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ items: entries.map(p => ({ id:p.id, quantity:cart[p.id], price:p.price })), amount: subtotal, address }) })
        const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not place order.')
        setSuccess(`Order ${data.orderId} placed successfully. Pay ${money(subtotal)} on delivery.`); return
      }
      const ready = await loadRazorpay(); if (!ready) throw new Error('Unable to load the secure payment window. Check your connection and try again.')
      const orderResponse = await fetch('/api/payments/create-order', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ amount: subtotal, receipt: `dm_${Date.now()}` }) })
      const order = await orderResponse.json(); if (!orderResponse.ok) throw new Error(order.error || 'Could not start payment.')
      await new Promise<void>((resolve, reject) => {
        const options = { key: order.keyId, amount: order.amount, currency: order.currency, name: 'DailyMart', description: 'DailyMart order', order_id: order.id,
          prefill: { name: address.name }, theme: { color: '#24553d' },
          handler: async (response: any) => {
            try { const verify = await fetch('/api/payments/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ orderId:response.razorpay_order_id, paymentId:response.razorpay_payment_id, signature:response.razorpay_signature }) }); const result = await verify.json(); if (!result.verified) throw new Error('Payment verification failed.'); setSuccess(`Payment successful. Payment ID: ${response.razorpay_payment_id}`); resolve() } catch (e) { reject(e) }
          }, modal: { ondismiss: () => reject(new Error('Payment window closed.')) } }
        const instance = new (window as any).Razorpay(options); instance.on('payment.failed', (r:any) => reject(new Error(r?.error?.description || 'Payment failed.'))); instance.open()
      })
    } catch (e) { setError(e instanceof Error ? e.message : 'Payment failed.') } finally { setBusy(false) }
  }
  if (!entries.length) return <div className="empty-state"><ShoppingBag size={44} strokeWidth={1.3} /><h3>A little empty, a lot of possibilities.</h3><p>Let&apos;s find something for your everyday.</p><Button onClick={close}>Explore the store <ArrowRight data-icon="inline-end" /></Button></div>
  return <div className="panel-stack"><div className="cart-delivery"><MapPin size={20} /><div><strong>Deliver to {address.label}</strong><p>{address.street}, {address.city} {address.pin}</p></div><button className="text-link" onClick={editAddress}>Change</button></div><div className="cart-items">{entries.map(product => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} width={68} height={68} /><div><strong>{product.name}</strong><span>{product.unit}</span><b>{money(product.price)}</b></div><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => update(product.id, -1)}><Minus size={14} /></button><span>{cart[product.id]}</span><button disabled={cart[product.id] >= 10} aria-label={`Add one ${product.name}`} onClick={() => update(product.id, 1)}><Plus size={14} /></button></div></div>)}</div><div className="savings"><Check size={16} /> You&apos;re saving {money(saved)} on these picks</div><div className="order-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Delivery</span><span>Free</span></div><div className="order-total"><strong>Total</strong><strong>{money(subtotal)}</strong></div></div>{success ? <div className="notice success-notice"><Check size={18} /><span>{success}</span></div> : checkout ? <><fieldset className="payment-options"><legend>Secure checkout</legend>{[{ id: 'upi', title: 'UPI & wallets', subtitle: 'Google Pay, PhonePe, Paytm and more', icon: Smartphone }, { id: 'card', title: 'Credit / debit card', subtitle: 'Visa, Mastercard & RuPay', icon: CreditCard }, { id: 'cod', title: 'Cash on delivery', subtitle: 'Pay when your order arrives', icon: Banknote }].map(({ id, title, subtitle, icon: Icon }) => <label className={`payment-option${payment === id ? ' active' : ''}`} key={id}><input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} /><Icon size={21} /><span><strong>{title}</strong><small>{subtitle}</small></span></label>)}</fieldset>{error && <div className="notice error-notice"><Info size={17} /><span>{error}</span></div>}<Button size="lg" disabled={busy} onClick={pay}>{busy ? 'Opening secure checkout…' : payment === 'cod' ? `Place COD order · ${money(subtotal)}` : `Pay securely · ${money(subtotal)}`} <ArrowRight data-icon="inline-end" /></Button><p className="fine-print">Online payments are processed securely by Razorpay. Your card/UPI details are never sent to this site.</p><Button variant="ghost" disabled={busy} onClick={() => setCheckout(false)}>Back to your bag</Button></> : <><Button size="lg" onClick={() => setCheckout(true)}>Continue to secure checkout <ArrowRight data-icon="inline-end" /></Button><p className="fine-print">Choose UPI, card or cash on delivery at checkout.</p></>}</div>
}

export function ProductDetail({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return <div className="product-detail"><img src={product.image} alt={product.name} width={500} height={330} /><span className="eyebrow">{product.category}</span><p>{product.description}</p><span className="product-unit">{product.unit} · {product.rating} / 5 demo rating</span><div className="detail-price"><strong>{money(product.price)}</strong><s>{money(product.original)}</s></div><Button size="lg" onClick={onAdd}>Add to bag <Plus data-icon="inline-end" /></Button><p className="fine-print">Illustrative demo product and pricing.</p></div>
}

export function HelpPanel({ onCategory }: { onCategory: (category: string) => void }) {
  const [messages, setMessages] = useState<Array<{role:'bot'|'user'; text:string}>>([{ role:'bot', text:'Hi! I’m Daily. Ask me about products, prices, delivery or checkout.' }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => { const el=scrollRef.current; if (el) el.scrollTop=el.scrollHeight }, [messages, busy])
  const send = async (text=input) => {
    const value=text.trim(); if (!value || busy) return
    setInput(''); setMessages(m=>[...m,{role:'user',text:value}]); setBusy(true)
    try { const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:value})}); const d=await r.json(); setMessages(m=>[...m,{role:'bot',text:d.reply || 'I could not find an answer.'}]) }
    catch { setMessages(m=>[...m,{role:'bot',text:'I’m having trouble connecting right now. Please try again.'}]) }
    finally { setBusy(false) }
  }
  return <div className="assistant-chat"><div className="help-intro"><span className="assistant-orb"><Sparkles size={26} /></span><h3>Meet Daily</h3><p>Your shopping assistant, now actually connected.</p></div><div className="chat-messages" ref={scrollRef} aria-live="polite">{messages.map((m,i)=><div key={i} className={`chat-bubble ${m.role}`}>{m.text}</div>)}{busy&&<div className="chat-bubble bot typing">Daily is thinking…</div>}</div><div className="chat-suggestions"><button onClick={()=>send('Show me electronics')}>Electronics</button><button onClick={()=>send('What can I buy under ₹500?')}>Under ₹500</button><button onClick={()=>send('How can I pay?')}>Payment help</button></div><div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}} placeholder="Ask Daily anything…" aria-label="Message Daily" maxLength={500}/><Button onClick={()=>send()} disabled={!input.trim()||busy}>Send</Button></div><div className="help-categories"><Button variant="outline" onClick={() => onCategory('Fruits & Vegetables')}>Fresh groceries</Button><Button variant="outline" onClick={() => onCategory('Electronics')}>Tech finds</Button><Button variant="outline" onClick={() => onCategory('Home & Kitchen')}>For your home</Button></div></div>
}

export function AccountPanel() { return <div className="panel-stack"><div className="help-intro"><Heart size={32} /><h3>Your everyday, made personal.</h3><p>An account will keep your orders, addresses, and favourites together.</p></div><Link className="primary-button" href="/login">Log in <ArrowRight size={16} /></Link><Link className="outline-button" href="/register">Create an account</Link><Button variant="ghost" disabled>Log out · No active session</Button><div className="notice"><Info size={17} /><span>Accounts aren&apos;t connected yet. You are browsing as a guest; there is no active session to log out of.</span></div></div> }
