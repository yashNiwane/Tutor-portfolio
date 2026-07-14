/* =====================================================
   YASH NIWANE — Portfolio Script v2
   Navbar · Reveal · Gallery · Lightbox · Docs · Form
   ===================================================== */
'use strict';

/* ── Utility: format file size ── */
function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024)    return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

/* ══════════════════════════════════════════
   INLINE FALLBACK MANIFESTS
   Used when fetch() fails (e.g. file:// protocol).
   Re-run generate-manifests.js then update these
   if you add new files to assets/ or docs/.
══════════════════════════════════════════ */
const ASSETS_MANIFEST = [
  {
    "filename": "Guru Ashish coaching classes.jpg",
    "title": "Guru Ashish Coaching Classes",
    "description": "Teaching session at Guru Ashish Coaching Classes, Dehu, Pune — Mathematics & Science tutoring.",
    "category": "Teaching",
    "sizeBytes": 3730466
  },
  {
    "filename": "Naval Pay Office Birthday Celibration.jpg",
    "title": "Naval Pay Office – Team Celebration",
    "description": "Team celebration event at the Naval Pay Office, Pune.",
    "category": "Professional",
    "sizeBytes": 122123
  },
  {
    "filename": "Stek IT Education Team.jpg",
    "title": "S-tek IT Education Team",
    "description": "Team photo at S-tek IT Education, Pune — Full-Stack Development Training faculty and students.",
    "category": "Training",
    "sizeBytes": 3725221
  },
  {
    "filename": "hackathon.jpg",
    "title": "Hackathon – Top 20 Finalist",
    "description": "\"Innovative You\" Hackathon — Selected as a Top 20 finalist out of 250+ participants.",
    "category": "Achievement",
    "sizeBytes": 983040
  },
  {
    "filename": "naval pay office team.jpg",
    "title": "Naval Pay Office – Team",
    "description": "Software development team at the Indian Navy, Naval Pay Office, Pune.",
    "category": "Professional",
    "sizeBytes": 1295363
  }
];

const DOCS_MANIFEST = [
  {
    "filename": "yash_niwaneR2.pdf",
    "title": "Resume / CV",
    "description": "Yash Niwane's latest teaching resume with experience, skills, and qualifications.",
    "type": "pdf",
    "sizeBytes": 109735,
    "icon": "file-text"
  },
  {
    "filename": "NPO Certificate.pdf",
    "title": "Naval Pay Office Certificate",
    "description": "Certificate of employment and recognition from the Indian Navy, Naval Pay Office, Pune.",
    "type": "pdf",
    "sizeBytes": 393965,
    "icon": "award"
  },
  {
    "filename": "orbiqe-experience-letter.pdf",
    "title": "Experience Letter – Orbiqe",
    "description": "Official experience letter from Orbiqe Technologies, validating professional software development experience.",
    "type": "pdf",
    "sizeBytes": 484619,
    "icon": "briefcase"
  }
];

/* Helper: fetch JSON with inline fallback */
async function loadManifest(url, fallback) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('not ok');
    return await r.json();
  } catch {
    return fallback;
  }
}

/* ══════════════════════════════════════════
   NAVBAR — scroll + mobile toggle
══════════════════════════════════════════ */
(function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const menuBtn     = document.getElementById('mobile-menu-btn');
  const mobileMenu  = document.getElementById('mobile-menu');
  const hamburger   = document.getElementById('hamburger-icon');
  const closeIcon   = document.getElementById('close-icon');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    mobileMenu.classList.remove('hidden');
    hamburger.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    hamburger.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', () => {
    menuBtn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => { if (!navbar.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();

/* ══════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
══════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ══════════════════════════════════════════
   GALLERY — manifest, render, filter, lightbox
══════════════════════════════════════════ */
(function initGallery() {
  const grid       = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightbox-img');
  const lbTitle    = document.getElementById('lightbox-title');
  const lbDesc     = document.getElementById('lightbox-desc');
  const lbClose    = document.getElementById('lightbox-close');
  const lbPrev     = document.getElementById('lightbox-prev');
  const lbNext     = document.getElementById('lightbox-next');

  let items      = [];
  let currentIdx = 0;

  /* Render */
  function renderGallery(data) {
    items = data;
    grid.innerHTML = '';
    data.forEach((item, i) => {
      const src    = `assets/${encodeURIComponent(item.filename)}`;
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      figure.setAttribute('role', 'listitem');
      figure.setAttribute('tabindex', '0');
      figure.setAttribute('data-category', item.category);
      figure.setAttribute('data-index', i);
      figure.setAttribute('aria-label', `${item.title} – click to enlarge`);

      figure.innerHTML = `
        <img src="${src}" alt="${item.description}" loading="lazy" decoding="async" width="600" height="400" style="aspect-ratio:auto"/>
        <div class="gallery-overlay" aria-hidden="true">
          <div class="gallery-overlay-text">
            <span class="gallery-overlay-badge">${item.category}</span>
            <p class="gallery-overlay-title">${item.title}</p>
          </div>
        </div>
      `;

      figure.addEventListener('click', () => openLightbox(i));
      figure.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
      grid.appendChild(figure);
    });
  }

  /* Filter */
  function applyFilter(category) {
    grid.querySelectorAll('.gallery-item').forEach(fig => {
      const match = category === 'all' || fig.dataset.category === category;
      fig.dataset.hidden = match ? 'false' : 'true';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(btn.dataset.filter);
    });
  });

  /* Lightbox helpers */
  function getVisibleItems() {
    return Array.from(grid.querySelectorAll('.gallery-item[data-hidden="false"], .gallery-item:not([data-hidden])'));
  }

  function openLightbox(globalIdx) {
    const visible = getVisibleItems();
    const domEl   = grid.querySelector(`.gallery-item[data-index="${globalIdx}"]`);
    currentIdx    = visible.indexOf(domEl);
    if (currentIdx < 0) currentIdx = 0;
    showSlide(currentIdx, visible);
    lightbox.showModal();
  }

  function showSlide(idx, visible) {
    const domEl     = visible[idx];
    if (!domEl) return;
    const globalIdx = parseInt(domEl.dataset.index, 10);
    const item      = items[globalIdx];
    lbImg.src            = `assets/${encodeURIComponent(item.filename)}`;
    lbImg.alt            = item.description;
    lbTitle.textContent  = item.title;
    lbDesc.textContent   = item.description;
    currentIdx           = idx;
  }

  lbClose.addEventListener('click', () => lightbox.close());
  lbPrev.addEventListener('click', () => {
    const v = getVisibleItems();
    currentIdx = (currentIdx - 1 + v.length) % v.length;
    showSlide(currentIdx, v);
  });
  lbNext.addEventListener('click', () => {
    const v = getVisibleItems();
    currentIdx = (currentIdx + 1) % v.length;
    showSlide(currentIdx, v);
  });

  lightbox.addEventListener('keydown', (e) => {
    if (!lightbox.open) return;
    const v = getVisibleItems();
    if (e.key === 'ArrowLeft')  { e.preventDefault(); currentIdx = (currentIdx - 1 + v.length) % v.length; showSlide(currentIdx, v); }
    if (e.key === 'ArrowRight') { e.preventDefault(); currentIdx = (currentIdx + 1) % v.length; showSlide(currentIdx, v); }
    if (e.key === 'Escape')     { lightbox.close(); }
  });

  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });

  /* Fetch manifest — falls back to inline data if fetch fails (e.g. file://) */
  loadManifest('manifest.assets.json', ASSETS_MANIFEST).then(data => renderGallery(data));
})();

/* ══════════════════════════════════════════
   DOCUMENTS — manifest render
══════════════════════════════════════════ */
(function initDocuments() {
  const docsGrid = document.getElementById('docs-grid');

  const typeConfig = {
    pdf: {
      iconStyle: 'background:linear-gradient(135deg,#fee2e2,#fecaca);color:#dc2626',
      label: 'PDF',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
    },
    default: {
      iconStyle: 'background:linear-gradient(135deg,#e2e8f0,#cbd5e1);color:#475569',
      label: 'FILE',
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    },
  };

  function renderDocs(data) {
    docsGrid.innerHTML = '';
    data.forEach(doc => {
      const cfg      = typeConfig[doc.type] || typeConfig.default;
      const filePath = `docs/${encodeURIComponent(doc.filename)}`;
      const size     = formatSize(doc.sizeBytes);

      const card = document.createElement('div');
      card.setAttribute('role', 'listitem');
      card.className = 'doc-card';

      card.innerHTML = `
        <div class="flex items-start gap-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="${cfg.iconStyle}">
            ${cfg.icon}
          </div>
          <div class="flex-1 min-w-0 pt-0.5">
            <p class="font-display font-bold text-ink-900 text-base leading-snug">${doc.title}</p>
            ${size ? `<p class="text-[11px] text-ink-400 font-bold mt-1 uppercase tracking-widest">${cfg.label} &middot; ${size}</p>` : ''}
          </div>
        </div>
        <p class="text-sm text-ink-500 leading-relaxed">${doc.description}</p>
        <div class="flex gap-2.5 mt-auto pt-1">
          <a href="${filePath}" target="_blank" rel="noopener noreferrer"
             class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 border-brand-200 text-brand-700 text-sm font-bold hover:bg-brand-50 hover:border-brand-400 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            View
          </a>
          <a href="${filePath}" download="${doc.filename}"
             class="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400"
             style="background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 4px 14px rgba(34,197,94,0.28)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download
          </a>
        </div>
      `;

      docsGrid.appendChild(card);
    });
  }

  /* Fetch manifest — falls back to inline data if fetch fails (e.g. file://) */
  loadManifest('manifest.docs.json', DOCS_MANIFEST).then(data => renderDocs(data));
})();

/* ══════════════════════════════════════════
   CONTACT FORM — mailto
══════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contact-name').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before sending.');
      return;
    }

    const body   = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:niwaneyash@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

/* ══════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════ */
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ══════════════════════════════════════════
   SMOOTH SCROLL (anchor fallback)
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
