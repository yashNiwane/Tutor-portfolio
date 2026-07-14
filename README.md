# Yash Niwane — Teaching Portfolio

A modern, fully responsive personal portfolio website for teaching job applications.

**Live site:** [yashniwane.github.io/Tutor-portfolio](https://yashniwane.github.io/Tutor-portfolio)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | Semantic HTML5 |
| Styling | Tailwind CSS (CDN) + custom `style.css` |
| Logic | Vanilla JavaScript (`script.js`) |
| Fonts | Google Fonts — *Lora* (headings) + *Inter* (body) |

**No build step.** Open `index.html` directly in a browser, or serve the folder with any static file server.

---

## Project Structure

```
Tutor-portfolio/
├── index.html              # Main portfolio page
├── style.css               # Custom CSS (animations, gallery, lightbox, etc.)
├── script.js               # All client-side JS (navbar, gallery, docs, form)
├── manifest.assets.json    # Gallery image manifest (auto-generated)
├── manifest.docs.json      # Documents manifest (auto-generated)
├── generate-manifests.js   # Script to regenerate both manifests
├── README.md               # This file
├── assets/                 # Gallery images (JPG, PNG, WebP, etc.)
│   ├── Guru Ashish coaching classes.jpg
│   ├── Stek IT Education Team.jpg
│   └── ...
└── docs/                   # Downloadable documents (PDF, DOCX, etc.)
    ├── yash_niwaneR2.pdf
    ├── NPO Certificate.pdf
    └── ...
```

---

## Sections

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | Name, title, tagline, CTA buttons, quick stats |
| 2 | **About** | Bio, teaching philosophy quote, skill tags |
| 3 | **Experience** | Teaching roles, industry experience, achievements, education |
| 4 | **Gallery** | Filterable image grid with lightbox, lazy-loaded |
| 5 | **Documents** | Downloadable/viewable credential cards |
| 6 | **Contact** | Contact info + mailto-based message form |

---

## Adding New Files

### Adding a new gallery image

1. Drop the image file into the `assets/` folder.
2. Run the manifest generator:
   ```bash
   node generate-manifests.js
   ```
3. Open `manifest.assets.json` and optionally customize the auto-generated `title`, `description`, and `category` for the new entry.

### Adding a new document

1. Drop the file into the `docs/` folder.
2. Run the manifest generator:
   ```bash
   node generate-manifests.js
   ```
3. Open `manifest.docs.json` and optionally update the `title` and `description` for the new entry.

> **Note:** The generator **preserves** existing titles and descriptions for files already in the manifest. Only new files get auto-generated values.

---

## Running Locally

### Option 1 — Open directly
```bash
# On Linux / macOS
xdg-open index.html   # Linux
open index.html        # macOS
```

### Option 2 — Python server (recommended for correct MIME types)
```bash
python3 -m http.server 8080
# Open: http://localhost:8080
```

### Option 3 — Node.js serve
```bash
npx serve .
# Open: http://localhost:3000
```

---

## Accessibility

- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`)
- All images have descriptive `alt` text
- Keyboard-navigable gallery lightbox (Arrow keys, Escape)
- `aria-label`, `aria-pressed`, `aria-expanded`, `aria-modal` on interactive elements
- Focus-visible styles on all interactive elements
- Respects `prefers-reduced-motion`

---

## Customization

| What | Where |
|------|-------|
| Personal info | `index.html` — Hero, About, Experience, Contact sections |
| Colors / accent | `tailwind.config` in `index.html` → `theme.extend.colors.sage` |
| Fonts | `index.html` → Google Fonts `<link>` |
| Animation timing | `style.css` → `@keyframes` and `.reveal` transition |
| Gallery layout | `style.css` → `.gallery-item` styles |

---

## Deployment (GitHub Pages)

1. Push the folder contents to a GitHub repository.
2. Go to **Settings → Pages → Source** → select `main` branch, root `/`.
3. GitHub Pages will serve the site at `https://<username>.github.io/<repo-name>/`.
