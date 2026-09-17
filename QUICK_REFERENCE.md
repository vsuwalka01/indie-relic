# 🚀 Indie Relic - Quick Reference Card

Keep this handy while developing!

---

## ⚡ Most Used Commands

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Build for production
npm start        # Run production build locally
npm run lint     # Check for errors
npm install      # Install dependencies
```

---

## 📁 File Locations

| Task | File |
|------|------|
| Change brand name | `src/components/Header.tsx` line 12 |
| Change colors | `tailwind.config.js` line 5 |
| Change home content | `src/app/page.tsx` line 80 |
| Change products | `src/app/products/page.tsx` line 10 |
| Change footer | `src/components/Footer.tsx` line 4 |
| Update about page | `src/app/about/page.tsx` line 45 |
| Global styles | `src/app/globals.css` |
| Page animations | Use `<motion.div>` from framer-motion |

---

## 🎨 Tailwind Classes (Most Common)

### Spacing
```tsx
px-4          // Horizontal padding
py-8          // Vertical padding
mt-4          // Margin top
mb-8          // Margin bottom
gap-4         // Gap between flex items
```

### Text
```tsx
text-lg       // Large text
font-bold     // Bold text
text-center   // Center text
text-primary  // Use primary color
```

### Background
```tsx
bg-light      // Light background
bg-primary    // Primary color background
bg-accent     // Accent background
```

### Responsive
```tsx
md:text-lg    // Text-lg on medium+ screens
lg:grid-cols-3  // 3 columns on large+ screens
hidden md:flex  // Hidden on mobile, flex on medium+
```

### Common Patterns
```tsx
className="space-y-4"           // Vertical spacing
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"  // Responsive grid
className="flex items-center justify-between"  // Flex row, centered, spaced
```

---

## 🎬 Framer Motion (Animations)

### Basic Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</motion.div>
```

### Slide Up
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Hover Animation
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### View Animation (on scroll)
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
  Animates when scrolled into view
</motion.div>
```

### Stagger Children
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {children.map((child) => (
    <motion.div key={child.id} variants={itemVariants}>
      {child}
    </motion.div>
  ))}
</motion.div>
```

---

## 🛠️ Adding Things

### Add Navigation Link
1. Open `src/components/Header.tsx`
2. Find `navLinks` array
3. Add: `{ label: 'Link Name', href: '/path' }`

### Add New Page
1. Create: `src/app/pagename/page.tsx`
2. Use template from existing page
3. Link from Header.tsx

### Add Product to Featured
1. Open `src/app/page.tsx`
2. Find `featuredProducts` array
3. Add product object

### Change Hero Image/Text
1. Open `src/app/page.tsx`
2. Find Hero Section
3. Edit `<motion.h1>` and `<motion.p>` content

### Add Social Media Link
1. Open `src/components/Footer.tsx`
2. Find `socialLinks` array
3. Add new icon and link

---

## 🎨 Color Quick Reference

Update in `tailwind.config.js`:

```js
colors: {
  primary: '#1F2937',    // Dark gray (main brand)
  secondary: '#D4A574',  // Gold (highlights)
  accent: '#F3E5D8',     // Cream (backgrounds)
  dark: '#0F172A',       // Very dark
  light: '#F8F7F4',      // Off-white
}
```

**Usage:**
```tsx
className="bg-primary"     // Primary color background
className="text-secondary" // Secondary text color
className="border-accent"  // Accent border
```

---

## 📱 Responsive Design

```tsx
// Mobile first
<div className="
  text-base              // Base size on mobile
  md:text-lg             // Medium screens (768px+)
  lg:text-xl             // Large screens (1024px+)
  hidden md:block         // Hidden on mobile, shown on medium+
  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  // Responsive grid
">
```

---

## 🔧 Useful Snippets

### Button Variants
```tsx
// Primary button
<button className="btn-primary">Click</button>

// Secondary button
<button className="btn-secondary">Click</button>

// Icon button
<button className="btn-icon">
  <Icon size={20} />
</button>
```

### Product Card
```tsx
<div className="product-card">
  <img src={image} alt={name} />
  <div className="p-6">
    <h3 className="font-display text-lg font-bold">{name}</h3>
    <p className="text-secondary">${price}</p>
  </div>
</div>
```

### Section Container
```tsx
<div className="max-w-7xl mx-auto px-4 py-16">
  {/* Content */}
</div>
```

### Section Title
```tsx
<h2 className="section-title">Title</h2>
<p className="section-subtitle">Subtitle</p>
```

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Changes not showing | Hard refresh: `Ctrl+Shift+R` or clear `.next/` folder |
| Port 3000 in use | Run on different port: `npm run dev -- -p 3001` |
| Module errors | Reinstall: `rm -rf node_modules && npm install` |
| TypeScript errors | Check `tsconfig.json` or restart dev server |
| Styling not applying | Check Tailwind class spelling |

---

## 📚 Import Statements (Copy-Paste)

```tsx
// Animations
import { motion } from 'framer-motion';

// Icons
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

// Navigation
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// State (if added)
import { create } from 'zustand';
```

---

## 🔗 Key Routes

| Route | Component |
|-------|-----------|
| `/` | `src/app/page.tsx` |
| `/products` | `src/app/products/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/privacy` | `src/app/privacy/page.tsx` |
| `/terms` | `src/app/terms/page.tsx` |
| `/returns` | `src/app/returns/page.tsx` |

---

## 💾 Git Commands

```bash
git status                 # Check changes
git add .                  # Stage all files
git commit -m "Message"    # Create commit
git push                   # Push to remote
git pull                   # Pull updates
```

---

## 📦 Project Size

| Metric | Value |
|--------|-------|
| Total Files | 17 |
| React Components | 2 |
| Pages | 6 |
| Dependencies | ~20 |
| Bundle Size | ~150KB (gzipped) |

---

## ✅ Checklist Before Deploy

- [ ] Update brand name (Header + Footer)
- [ ] Change colors (tailwind.config.js)
- [ ] Update company info (Footer)
- [ ] Add product images
- [ ] Test on mobile
- [ ] Test navigation
- [ ] Check links work
- [ ] Update legal pages
- [ ] Set up analytics
- [ ] Test forms
- [ ] Check performance
- [ ] Run `npm run build` (no errors)

---

## 🚀 Deploy Commands

### Vercel
```bash
npm install -g vercel
vercel login
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### Manual (Server)
```bash
npm run build
npm start
```

---

## 🆘 Common Tasks

| Task | Steps |
|------|-------|
| Change theme color | Edit `tailwind.config.js` colors section |
| Add footer link | Edit `src/components/Footer.tsx` footerSections array |
| Update hero text | Edit `src/app/page.tsx` Hero Section heading |
| Add new nav link | Edit `src/components/Header.tsx` navLinks array |
| Create new page | Create `src/app/newpage/page.tsx` |
| Add product | Edit `src/app/products/page.tsx` products array |

---

## 📞 Resources

- **Docs**: Check README.md
- **Setup**: See SETUP_GUIDE.md
- **Extensions**: See EXTENSION_GUIDE.md
- **Summary**: See IMPLEMENTATION_SUMMARY.md
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React**: https://react.dev

---

## 💡 Pro Tips

✨ **Always:**
- Test on mobile before pushing
- Use Tailwind classes (no inline CSS)
- Use Framer Motion for animations
- Keep components small
- Add comments for complex logic

⚡ **Performance:**
- Use `<Image>` instead of `<img>`
- Lazy load with `whileInView`
- Optimize images
- Code split components

🎯 **Best Practices:**
- Type everything with TypeScript
- Use semantic HTML
- Test accessibility
- Keep components reusable

---

**Bookmark this page!** 📍

Last Updated: September 2026
