'use client'

import { ArrowRight, ArrowUpRight, BadgeCheck, Headphones, Leaf, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { categories } from '@/lib/catalog'

export function Hero({ onShop }: { onShop: (category: string) => void }) {
  return <>
    <section className="hero-grid" aria-label="Featured collections">
      <div className="main-hero">
        <img className="hero-image" src="/images/fresh-market.png" alt="A canvas bag filled with farm-fresh vegetables, bread, and everyday groceries" fetchPriority="high" />
        <div className="hero-copy"><span className="eyebrow"><span /> FRESH FINDS. EVERY DAY.</span><h1>A little of everything.<br />A lot to love.</h1><p>Fresh groceries, the latest tech, and everyday<br className="desktop-break" /> essentials. All in one happy place.</p><button className="primary-button" onClick={() => onShop('All')}>Explore the store <ArrowRight size={17} /></button><div className="hero-proof"><span className="proof-icon"><Leaf size={14} /></span> Fresh picks. Fair prices. Delivered.</div></div>
      </div>
      <div className="tech-hero"><div className="tech-copy"><span className="eyebrow">BIG LITTLE UPGRADES</span><h2>Good tech. <br />Great prices.</h2><p>Up to <strong>40% off</strong> electronics</p><button onClick={() => onShop('Electronics')}>Find your upgrade <ArrowUpRight size={16} /></button></div><img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=85" alt="Premium black wireless over-ear headphones" /><span className="tech-sticker">SOUND<br /><strong>better.</strong></span></div>
    </section>
    <div className="benefits-bar">{[{ icon: Truck, title: 'Delivered to your doorstep', sub: 'Convenience, on your schedule' }, { icon: BadgeCheck, title: 'Quality you can count on', sub: 'Thoughtfully picked for you' }, { icon: ShieldCheck, title: 'Your choice of payment', sub: 'UPI, cards & cash · Preview only' }, { icon: PackageCheck, title: 'A little more peace of mind', sub: 'Simple shopping, from start to finish' }].map(({ icon: Icon, title, sub }) => <div className="benefit" key={title}><Icon size={23} strokeWidth={1.5} /><div><strong>{title}</strong><span>{sub}</span></div></div>)}</div>
  </>
}

export function Categories({ selected, onSelect }: { selected: string; onSelect: (category: string) => void }) {
  return <section className="category-section" aria-labelledby="categories-title"><div className="section-heading"><div><h2 id="categories-title">What&apos;s on your list?</h2><p>Little needs. Big possibilities.</p></div><button className="text-link" onClick={() => onSelect('All')}>Explore all <ArrowRight size={15} /></button></div><div className="category-grid">{categories.map(category => <button className={`category-item${selected === category.name ? ' selected' : ''}`} key={category.name} onClick={() => onSelect(category.name)} aria-pressed={selected === category.name}><div className="category-image" style={{ backgroundColor: category.color }}><img src={category.image} alt="" width={150} height={120} loading="lazy" /></div><span>{category.short}</span></button>)}</div></section>
}

export function BottomSections({ onShop, onHelp }: { onShop: (category: string) => void; onHelp: () => void }) {
  return <><section className="bottom-promos"><div className="home-promo"><div><span className="eyebrow">SMALL TOUCHES, BIG DIFFERENCE</span><h2>Make everyday<br />feel a little better.</h2><p>Thoughtful essentials for a happy home.</p><button className="text-link" onClick={() => onShop('Home & Kitchen')}>Discover home & living <ArrowRight size={16} /></button></div><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=420&q=85" alt="Green plant in a minimal ceramic pot" loading="lazy" /></div><div className="assistant-promo"><span className="assistant-orb"><Sparkles size={26} /></span><div><span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span><h2>Your shopping sidekick.</h2><p>Not sure where to start? Find your next<br />favourite with a little help from Daily.</p><button className="text-link" onClick={onHelp}>Meet your assistant <ArrowRight size={16} /></button></div></div></section><footer className="site-footer"><a className="brand" href="/">daily<span>mart</span><span className="brand-dot">.</span></a><p>Everything for your everyday.</p><div><span>Demo storefront · No orders or payments are processed.</span><button onClick={onHelp}><Headphones size={15} /> Need a hand?</button></div></footer></>
}
