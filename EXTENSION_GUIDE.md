# 🔧 Indie Relic - Extension & Feature Guide

Guide to adding new features and pages to your e-commerce store.

---

## 📝 Adding a New Page

### Step 1: Create Folder Structure
```bash
src/app/your-new-page/
└── page.tsx
```

### Step 2: Create Page Component
Create `src/app/your-new-page/page.tsx`:
```tsx
'use client';

import { motion } from 'framer-motion';

export default function YourPageName() {
  return (
    <div className="min-h-screen bg-light">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <h1 className="font-display text-5xl font-bold">Page Title</h1>
        <p className="text-lg text-gray-600 mt-4">Your content here</p>
      </motion.div>
    </div>
  );
}
```

### Step 3: Add Navigation Link
Edit `src/components/Header.tsx` - add to `navLinks` array:
```tsx
{ label: 'Your Link', href: '/your-new-page' }
```

✅ **Done!** Route automatically created at `/your-new-page`

---

## 🛍️ Adding Shopping Cart

### Step 1: Create Store (Zustand)
Create `src/lib/store.ts`:
```tsx
import { create } from 'zustand';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items;
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      set({
        items: items.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({ items: [...items, item] });
    }
  },
  removeItem: (id) => set({
    items: get().items.filter(i => i.id !== id)
  }),
  updateQuantity: (id, quantity) => set({
    items: get().items.map(i =>
      i.id === id ? { ...i, quantity } : i
    )
  }),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  )
}));
```

### Step 2: Use in Components
```tsx
'use client';

import { useCart } from '@/lib/store';

export default function ProductCard({ product }) {
  const addItem = useCart((state) => state.addItem);

  return (
    <button onClick={() => addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    })}>
      Add to Cart
    </button>
  );
}
```

### Step 3: Create Cart Page
Create `src/app/cart/page.tsx`:
```tsx
'use client';

import { useCart } from '@/lib/store';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, total, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>
        
        {items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white p-6 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-600">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-secondary"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-accent p-6 rounded-lg text-right">
              <p className="text-2xl font-bold">
                Total: ${total().toFixed(2)}
              </p>
              <button className="btn-primary mt-4">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 🔐 Adding User Authentication

### Step 1: Create Auth Store
Create `src/lib/auth.ts`:
```tsx
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    // Call your backend API
    // const response = await fetch('/api/login', { ... })
    set({ isLoading: false });
  },
  
  logout: () => set({ user: null }),
  
  register: async (email, password, name) => {
    set({ isLoading: true });
    // Call your backend API
    // const response = await fetch('/api/register', { ... })
    set({ isLoading: false });
  }
}));
```

### Step 2: Create Login Page
Create `src/app/login/page.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h1 className="font-display text-3xl font-bold mb-6">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
```

---

## 💳 Adding Stripe Payment

### Step 1: Install Package
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### Step 2: Create Payment Component
Create `src/components/PaymentForm.tsx`:
```tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
      return;
    }

    // Send paymentMethod.id to your backend
    const response = await fetch('/api/pay', {
      method: 'POST',
      body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
    });

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-primary mt-4"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
```

### Step 3: Add to Checkout Page
```tsx
import PaymentForm from '@/components/PaymentForm';

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>
      <PaymentForm />
    </div>
  );
}
```

---

## 🔍 Adding Search Functionality

### Step 1: Create Search Store
Create `src/lib/search.ts`:
```tsx
import { create } from 'zustand';

interface SearchStore {
  query: string;
  setQuery: (query: string) => void;
  results: any[];
  search: (products: any[]) => void;
}

export const useSearch = create<SearchStore>((set, get) => ({
  query: '',
  results: [],
  
  setQuery: (query) => {
    set({ query });
    get().search([]);
  },
  
  search: (products) => {
    const query = get().query.toLowerCase();
    const results = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    set({ results });
  }
}));
```

### Step 2: Add Search Component
```tsx
import { useSearch } from '@/lib/search';
import { Search } from 'lucide-react';

export function SearchBar() {
  const { query, setQuery } = useSearch();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-gray-400" />
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
}
```

---

## 📧 Adding Email Newsletter

### Step 1: Create Newsletter Component
```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
        required
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="btn-primary"
      >
        Subscribe
      </motion.button>
      {submitted && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-sm"
        >
          ✓ Subscribed!
        </motion.p>
      )}
    </form>
  );
}
```

---

## 🗺️ Adding Google Maps

### Step 1: Install Package
```bash
npm install @react-google-maps/api
```

### Step 2: Create Map Component
Create `src/app/craft-map/page.tsx`:
```tsx
'use client';

import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CraftMapPage() {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const artisans = [
    {
      id: 1,
      name: 'Sarah\'s Pottery',
      lat: 40.7128,
      lng: -74.0060,
      description: 'Handmade ceramic bowls and vases'
    },
    // Add more artisans
  ];

  return (
    <div className="h-screen">
      <GoogleMap
        center={{ lat: 40.7128, lng: -74.0060 }}
        zoom={10}
        mapContainerClassName="w-full h-full"
      >
        {artisans.map((artisan) => (
          <Marker
            key={artisan.id}
            position={{ lat: artisan.lat, lng: artisan.lng }}
            onClick={() => setSelectedMarker(artisan)}
          />
        ))}
        
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h3 className="font-bold">{selectedMarker.name}</h3>
              <p className="text-sm">{selectedMarker.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
```

---

## 📊 Adding Analytics

### Google Analytics
1. Install: `npm install @react-google-analytics`
2. Add to `src/app/layout.tsx`:
```tsx
import { useEffect } from 'react';
import { pageview } from '@/lib/analytics';

export default function RootLayout({ children }) {
  useEffect(() => {
    pageview();
  }, []);

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎯 Best Practices for Extensions

✅ **Do:**
- Keep components small and focused
- Use Tailwind for styling
- Use Framer Motion for animations
- Store state with Zustand
- Use TypeScript for type safety
- Test on mobile

❌ **Don't:**
- Add too many dependencies
- Mix multiple state management libraries
- Skip mobile testing
- Use inline styles
- Create mega-components

---

## 📚 Useful Libraries to Add

### UI/UX
- `react-hot-toast` - Notifications
- `react-helmet` - Head management
- `react-virtualized` - Large lists

### Data
- `swr` - Data fetching
- `react-query` - Server state
- `zod` - Schema validation

### Forms
- `react-hook-form` - Form handling
- `yup` - Form validation

### Database (if using backend)
- `prisma` - ORM
- `mongoose` - MongoDB
- `typeorm` - TypeORM

---

## 🚀 Deployment with New Features

```bash
# Build
npm run build

# Test production build
npm start

# Deploy to Vercel
vercel deploy

# Or Netlify
netlify deploy
```

---

## 💡 Extension Ideas

- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Customer testimonials
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Product image gallery
- [ ] Related products section
- [ ] Customer dashboard

---

**Happy Building!** 🚀

For questions, refer to the main README.md or SETUP_GUIDE.md
