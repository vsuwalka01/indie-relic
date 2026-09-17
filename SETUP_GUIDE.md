# 🚀 Indie Relic - Setup & Development Guide

A complete guide to getting your e-commerce store up and running.

## 📋 Prerequisites

Before you start, make sure you have:
- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)
- Git for version control

## ⚡ Quick Start (5 minutes)

### Step 1: Open Terminal
Navigate to the project folder:
```bash
cd C:\Users\doctor\Desktop\indie-store
```

### Step 2: Install Dependencies
```bash
npm install
```
This downloads all required packages (takes 1-2 minutes).

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Open in Browser
Visit: **http://localhost:3000**

🎉 **You're live!** The site auto-refreshes as you edit files.

---

## 📁 What's What

### Key Directories

| Folder | Purpose |
|--------|---------|
| `src/app/` | Page files (homepage, products, etc.) |
| `src/components/` | Reusable components (Header, Footer) |
| `public/` | Images, favicons, static files |
| `src/` | All source code |

### Important Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tailwind.config.js` | Color & styling config |
| `next.config.js` | Next.js settings |
| `PROJECT.md` | Development tracking |

---

## 🎨 Making Your First Change

### Change the Brand Name
1. Open `src/components/Header.tsx`
2. Find `<h3 className="font-display text-2xl font-bold text-primary">Indie Relic</h3>`
3. Replace `Indie Relic` with your brand name
4. Save - **browser updates automatically!**

### Change Colors
1. Open `tailwind.config.js`
2. Find the `colors:` section
3. Update the hex codes:
   ```js
   primary: '#YOUR_COLOR',      // Dark color
   secondary: '#YOUR_COLOR',    // Gold/accent color
   accent: '#YOUR_COLOR',       // Light cream color
   ```
4. Save and refresh browser

### Add a New Product
1. Open `src/app/products/page.tsx`
2. Find the `products` array
3. Add a new object:
   ```js
   {
     id: 9,
     name: 'Your Product Name',
     price: 49.99,
     category: 'Category Name',
     image: 'https://image-url.jpg'
   }
   ```

---

## 🛠️ Available Commands

```bash
# Start development server (with auto-refresh)
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Check for linting errors
npm run lint

# Full setup from scratch
npm run setup
```

---

## 🎯 Pages & Routes

| URL | Page | File |
|-----|------|------|
| `/` | Home | `src/app/page.tsx` |
| `/products` | All Products | `src/app/products/page.tsx` |
| `/about` | About Brand | `src/app/about/page.tsx` |
| `/privacy` | Privacy Policy | `src/app/privacy/page.tsx` |
| `/terms` | Terms of Service | `src/app/terms/page.tsx` |
| `/returns` | Return Policy | `src/app/returns/page.tsx` |

**To add a new page:**
1. Create a folder in `src/app/` (e.g., `src/app/contact/`)
2. Create `page.tsx` inside
3. Write React component
4. Route is automatically created!

---

## 🎬 Animations

All animations are powered by **Framer Motion**. Examples:

### Fade In
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
>
  Content
</motion.div>
```

### Hover Effects
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

---

## 📱 Responsive Design

The site uses **Tailwind CSS** breakpoints:

```tsx
// Mobile first (default)
<div className="text-sm">Text</div>

// Tablet and up
<div className="md:text-base">Text</div>

// Desktop and up
<div className="lg:text-lg">Text</div>
```

---

## 🎯 Common Tasks

### Add a New Navigation Link
1. Open `src/components/Header.tsx`
2. Find `navLinks` array
3. Add:
   ```js
   { label: 'Link Name', href: '/your-route' }
   ```

### Change Hero Text
1. Open `src/app/page.tsx`
2. Find the `<motion.h1>` in Hero Section
3. Update the text

### Add Footer Links
1. Open `src/components/Footer.tsx`
2. Find `footerSections` array
3. Add new section or link

### Update Company Info
1. Open `src/components/Footer.tsx`
2. Update email: `privacy@indierelic.com`
3. Update phone: `+1 (555) 123-4567`
4. Update address in contact section

---

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME=Indie Relic
```

### Brand Colors (Tailwind Config)
Edit `tailwind.config.js`:
```js
colors: {
  primary: '#1F2937',    // Main dark color
  secondary: '#D4A574',  // Accent/highlight
  accent: '#F3E5D8',     // Light background
  dark: '#0F172A',       // Extra dark
  light: '#F8F7F4',      // Off-white
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Connect GitHub account
4. Select `indie-store` repository
5. Click "Deploy"
6. Done! 🎉

### Deploy to Netlify
1. Push code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Click "Connect GitHub"
4. Select repository
5. Build command: `npm run build`
6. Publish directory: `.next`

### Deploy to Your Server
```bash
npm run build
npm start
```
Visit server IP/domain

---

## 🐛 Troubleshooting

### Error: "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Changes not showing up
1. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear `.next` folder: `rm -rf .next`
3. Restart server: Stop (Ctrl+C) and run `npm run dev` again

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Documentation](https://react.dev)

---

## 💡 Tips & Best Practices

✅ **Do:**
- Use Tailwind classes for styling
- Use Framer Motion for animations
- Test on mobile devices
- Use semantic HTML
- Keep components small and reusable

❌ **Don't:**
- Add inline styles
- Use deprecated React patterns
- Forget mobile responsiveness
- Skip accessibility features

---

## 🆘 Need Help?

Check these files:
- `PROJECT.md` - Development tracking
- `README.md` - Project overview
- `src/app/` - Existing page examples

---

## 📝 Notes

- All pages are in `src/app/` directory
- Components are in `src/components/`
- Styling uses Tailwind CSS utility classes
- Animations use Framer Motion library
- Mobile-first responsive approach
- Easy to customize and extend

---

**Happy Building! 🎉**

For questions, check the code comments or refer to the learning resources above.

**Last Updated**: September 2024
