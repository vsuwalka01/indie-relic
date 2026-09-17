# 🎨 Indie Relic - E-Commerce Store

An Indian heritage-craft marketplace ("Indian Traditions, Reimagined for Everyday Living"), built with Next.js 14, Tailwind CSS, and Framer Motion — matched to the source designs in `C:\Users\doctor\Desktop\indie\`.

![Status](https://img.shields.io/badge/status-development-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **🎯 Responsive Design** - Mobile-first approach, works perfectly on all devices
- **✨ Smooth Animations** - Beautiful transitions and interactions with Framer Motion
- **🛍️ Product Catalog** - Browse, filter, and search through products
- **🔍 Advanced Filtering** - Filter by category, price range, and more
- **🛒 Shopping Cart** - Add to cart with cart persistence
- **👤 User Accounts** - Register, login, and manage orders
- **📍 Craft Map** - Discover artisans and their locations
- **📱 Mobile Optimized** - Touch-friendly navigation and controls
- **♿ Accessible** - WCAG compliant, semantic HTML
- **🌙 Dark Mode Ready** - Theme support included

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Navigate to project directory
cd indie-store

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
indie-store/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global styles
│   │   ├── products/
│   │   │   └── page.tsx         # Products page
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   ├── privacy/
│   │   │   └── page.tsx         # Privacy policy
│   │   ├── terms/
│   │   │   └── page.tsx         # Terms of service
│   │   └── returns/
│   │       └── page.tsx         # Return policy
│   └── components/
│       ├── Header.tsx           # Navigation header
│       └── Footer.tsx           # Site footer
├── public/                      # Static assets
├── PROJECT.md                   # Project tracking
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
└── README.md                    # This file
```

## 🎨 Design System

### Colors
- **Cream**: `#F4F1DC` (page background)
- **Navy**: `#2F4D77` (primary brand color — hero cards, product footers, footer bg)
- **Navy Dark**: `#172B53` (logo ink, headings)
- **Gold**: `#DAAC54` (accents — craft-story cards, confetti icons)
- **Maroon**: `#9E2027` (nav links, icons, CTAs)

### Typography
- **Display Font**: Fraunces (serif) — substitute for the original paid TAN Nimbus font used in the source designs
- **Body Font**: Inter (sans-serif) — substitute for Calibri/Acumin

### Animations
- `fadeIn` - Fade in effect
- `slideUp` - Slide up from bottom
- `slideIn` - Slide from left
- `scale` - Scale up animation
- `float` - Floating motion effect

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 📦 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (Optional)
- **Platform**: [Medusa JS](https://www.medusajs.com/)
- **Database**: PostgreSQL
- **API**: REST + GraphQL

## 🎯 Pages Overview

### Home (`/`)
- Hero section with CTA
- Featured products showcase
- Brand value propositions
- Newsletter signup

### Products (`/products`)
- Product grid with filtering
- Search functionality
- Category filtering
- Price range slider
- Sort options

### About (`/about`)
- Brand story
- Mission and values
- Team profiles
- Company statistics

### Craft Map (`/craft-map`)
- Interactive map of artisans
- Artisan profiles
- Location details

### Account (`/account`)
- User registration/login
- Order history
- Profile management
- Address book

### Legal Pages
- **Privacy Policy** (`/privacy`)
- **Terms of Service** (`/terms`)
- **Return Policy** (`/returns`)

## 🎨 Customization

### Changing Brand Colors
Edit `tailwind.config.js` colors:
```js
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  // ...
}
```

### Adding Products
Update the products array in relevant page files or integrate with a backend API.

### Font Customization
Import different fonts in `src/app/layout.tsx` and update Tailwind config.

## 📝 Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME=Indie Relic
```

## 🔗 Integration Points

### E-Commerce Backend
- Connect to Medusa JS backend
- Update API endpoints in config
- Implement product fetching

### Payment Processing
- Stripe integration
- PayPal integration
- Local payment methods

### Analytics
- Google Analytics
- Mixpanel
- Hotjar

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## ✅ Quality Checklist

- [x] Responsive design
- [x] Performance optimized
- [x] Accessibility compliant
- [x] SEO friendly
- [x] Smooth animations
- [x] Mobile touch support
- [ ] Backend integration
- [ ] Payment processing
- [ ] Email notifications
- [ ] Analytics setup

## 🐛 Known Issues

None currently documented.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For questions or support:
- 📧 support@indierelic.com
- 💬 Contact form on website
- 📱 +1 (555) 123-4567

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Credits

Designed and built with ❤️ for independent artisans.

---

**Last Updated**: September 2024
**Version**: 1.0.0
