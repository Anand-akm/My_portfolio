# anandcodes.tech - Personal Portfolio

A premium, highly interactive personal portfolio website for Anand Mishra - AI Engineer & Full Stack Developer.

## 🚀 Tech Stack

- **Framework:** Next.js 15
- **React:** 19
- **TypeScript:** 5
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Custom + Radix UI
- **Icons:** Lucide React

## ✨ Features

- 🌓 Dark mode with neon/modern developer aesthetic
- 🎨 Premium glassmorphism design
- ⚡ Smooth animations and page transitions
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔍 SEO optimized with OpenGraph support
- 🚀 Fast loading and performance optimized
- 🖱️ Custom cursor with hover effects
- 📊 Scroll progress indicator
- ⌨️ Command menu navigation (⌘K)
- 🖥️ Terminal mode easter egg
- ⏳ Animated loading screen
- 🔲 Project filtering system
- 💬 Contact form with validation
- 📜 Animated timeline
- 🏆 Certification showcase
- ⭐ Testimonials carousel

## 📂 Project Structure

```
anandcodes-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx           # Homepage
│   │   ├── client-layout.tsx   # Client-side layout wrapper
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   └── sections/          # Page sections (Hero, About, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── data/                  # Static data and content
│   └── types/                 # TypeScript types
├── public/
│   ├── robots.txt            # SEO robots.txt
│   └── favicon.ico            # Site favicon
├── tailwind.config.js         # Tailwind configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/anandmishra/portfolio.git
cd portfolio
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build & Deploy

### Build for production:
```bash
npm run build
npm run start
```

### Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

Or use the Vercel dashboard to import your Git repository.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site URL (for SEO and OpenGraph)
NEXT_PUBLIC_SITE_URL=https://anandcodes.tech

# Contact form endpoint (optional)
CONTACT_EMAIL=anand@anandcodes.tech

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🎨 Customization

### Update Personal Info
Edit `src/data/content.ts` to update:
- Name and tagline
- Social links
- Skills categories
- Projects
- Experience timeline
- Certifications
- Testimonials

### Update Colors
Modify `src/app/globals.css`:
```css
:root {
  --primary: 217.2 91.2% 59.8%;    /* Blue */
  --secondary: 263.4 70% 50.4%;    /* Purple */
  --accent: 188 74% 47%;           /* Cyan */
  --background: 222.2 84% 4.9%;    /* Dark */
}
```

### Update SEO Metadata
Edit `src/app/layout.tsx` to update metadata.

## 🚀 Performance Features

- Static site generation (SSG)
- Image optimization with next/image
- Code splitting and lazy loading
- Font optimization with Google Fonts
- CSS optimization with Tailwind
- Bundle analysis ready

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🔒 Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Next.js team
- Vercel
- Framer Motion
- Lucide Icons
- Tailwind CSS
- Unsplash for placeholder images

---

Built with ❤️ by Anand Mishra

© 2024 anandcodes.tech - All rights reserved