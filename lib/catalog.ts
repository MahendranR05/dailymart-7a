export type Product = { id: string; name: string; category: string; unit: string; price: number; original: number; image: string; rating: string; tag?: string; description: string }
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=85`
export const products: Product[] = [
  { id: 'avocado', name: 'Fresh Hass Avocados', category: 'Fruits & Vegetables', unit: '2 pieces · approx. 400 g', price: 149, original: 199, image: photo('photo-1523049673857-eb18f1d7b578'), rating: '4.8', tag: 'Fresh pick', description: 'Creamy, delicious Hass avocados. Perfect for your morning toast, a fresh salad, or homemade guacamole.' },
  { id: 'strawberry', name: 'Farm-fresh Strawberries', category: 'Fruits & Vegetables', unit: '250 g', price: 99, original: 149, image: photo('photo-1464965911861-746a04b4bca6'), rating: '4.9', description: 'Juicy, naturally sweet strawberries. Rinse before enjoying as a snack or adding to your favourite breakfast.' },
  { id: 'headphones', name: 'Studio Wireless Headphones', category: 'Electronics', unit: 'Matte black · 1 year warranty', price: 2499, original: 3999, image: photo('photo-1546435770-a3e426bf472b'), rating: '4.7', tag: 'Bestseller', description: 'Meet your everyday soundtrack. Comfortable over-ear headphones with wireless connectivity and a clean, minimal design.' },
  { id: 'milk', name: 'Fresh Whole Milk', category: 'Dairy & Bakery', unit: '1 litre', price: 65, original: 75, image: photo('photo-1563636619-e9143da7973b'), rating: '4.8', description: 'A wholesome everyday essential for your coffee, cereal, and favourite recipes. Keep refrigerated.' },
  { id: 'skincare', name: 'Daily Hydrating Serum', category: 'Beauty & Care', unit: '30 ml · All skin types', price: 449, original: 599, image: photo('photo-1608571423902-eed4a5ad8108'), rating: '4.6', description: 'A light, everyday addition to your skincare routine. Patch test before use and follow the directions on the packaging.' },
  { id: 'bread', name: 'Artisan Sourdough Bread', category: 'Dairy & Bakery', unit: '400 g · Freshly baked', price: 129, original: 159, image: photo('photo-1509440159596-0249088772ff'), rating: '4.9', tag: 'Fresh pick', description: 'A golden crust and soft, airy centre. This artisan-style sourdough is made for generous sandwiches and slow breakfasts.' },
  { id: 'coffee', name: 'Roasted Arabica Coffee', category: 'Snacks & Drinks', unit: '250 g · Medium roast', price: 349, original: 449, image: photo('photo-1447933601403-0c6688de566e'), rating: '4.8', description: 'Rich, aromatic coffee for your daily ritual. Medium-roasted Arabica beans with a beautifully balanced flavour.' },
  { id: 'soap', name: 'Botanical Hand & Body Soap', category: 'Daily Essentials', unit: 'Set of 3 · 100 g each', price: 199, original: 299, image: '/images/botanical-soap.png', rating: '4.5', description: 'Thoughtful essentials for everyday care. A set of gently scented soap bars for hands and body.' },
  { id: 'home', name: 'Everyday Ceramic Mug', category: 'Home & Kitchen', unit: '350 ml · Sand', price: 299, original: 399, image: photo('photo-1514228742587-6b1558fcca3d'), rating: '4.7', description: 'Your new favourite mug. A warm, minimal ceramic design for coffee, tea, and little moments of calm.' },
  { id: 'plant', name: 'Little Green Desk Plant', category: 'Home & Kitchen', unit: 'Plant with ceramic pot', price: 399, original: 549, image: photo('photo-1485955900006-10f4d324d411'), rating: '4.8', description: 'Bring a little outdoors in with an easygoing green plant and a simple ceramic pot. A lovely companion for your desk.' },
]
export const categories = [
  { name: 'Fruits & Vegetables', short: 'Fruits & veggies', image: products[0].image, color: '#edf2df' },
  { name: 'Dairy & Bakery', short: 'Dairy & bakery', image: products[5].image, color: '#fff1df' },
  { name: 'Snacks & Drinks', short: 'Snacks & drinks', image: products[6].image, color: '#f4e9df' },
  { name: 'Electronics', short: 'Electronics', image: products[2].image, color: '#eaeaf3' },
  { name: 'Daily Essentials', short: 'Daily essentials', image: products[7].image, color: '#e4efe9' },
  { name: 'Beauty & Care', short: 'Beauty & care', image: products[4].image, color: '#f6e5e7' },
  { name: 'Home & Kitchen', short: 'Home & kitchen', image: products[8].image, color: '#edeae3' },
]
export const money = (value: number) => `₹${value.toLocaleString('en-IN')}`
export type Address = { label: string; name: string; street: string; city: string; pin: string }
export type Cart = Record<string, number>
export const demoAddresses: Address[] = [{ label: 'Home', name: 'Demo address', street: '12, Park Avenue, Indiranagar', city: 'Bengaluru', pin: '560038' }, { label: 'Work', name: 'Demo address', street: '24, Residency Road', city: 'Bengaluru', pin: '560025' }]
