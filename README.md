# Sushant Rahate - Portfolio

A **minimal, fast, and clean personal portfolio website** built using **Tailwind CSS** and plain **HTML + JavaScript**.

This project focuses on:

- ⚡ Speed and performance
- 🧼 Simple, readable structure
- 🌙 Dark mode support
- 🚫 No frameworks, no bloat

---

## ✨ Features

- Tailwind CSS (CLI setup)
- Dark mode using `class` strategy
- Fully static (perfect for GitHub Pages)
- Lightweight HTML + JS
- Easy to customize and extend

---

## 📁 Project Structure

```txt
.
├── docs/
│   ├── images/          # Static assets
│   ├── index.html       # Main HTML file
│   ├── output.css       # Generated Tailwind CSS
│   ├── script.js        # Theme toggle & JS
│   └── CNAME            # Custom domain (GitHub Pages)
├── input.css            # Tailwind entry file
├── tailwind.config.js   # Tailwind configuration
├── package.json
├── package-lock.json
├── .gitignore
```

## 🌐 Live Preview

View the portfolio live at  
👉 https://sushantrahate.com

##

🚀 Getting Started

1. Download and Install dependencies

```bash
npm install
```

2. Start development

```bash
npm run dev
```

This will:

- Compile Tailwind CSS
- Watch for changes
- Output CSS to docs/output.css

3. 🏗️ Build for Production

```bash
npm run build:css
```

- Generates same output.css but as minified CSS file
- Ready for deployment

## 🌐 Deployment

This project is 100% static, so it works great with:

- GitHub Pages
- Netlify
- Vercel (static)
- Any CDN or shared hosting

If using GitHub Pages:

- docs/ is served as the root
- CNAME is used for a custom domain

If you liked it then please show your love by ⭐ the repo
