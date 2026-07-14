#!/usr/bin/env node
/**
 * generate-manifests.js
 *
 * Scans ./assets/ and ./docs/ and regenerates:
 *   manifest.assets.json
 *   manifest.docs.json
 *
 * Usage:
 *   node generate-manifests.js
 *
 * After adding new files to assets/ or docs/,
 * simply run this script again — no code changes needed.
 */

const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const ASSETS_DIR = path.join(ROOT, 'assets');
const DOCS_DIR   = path.join(ROOT, 'docs');

/* ── Supported extensions ── */
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);
const DOC_EXT   = new Set(['.pdf', '.doc', '.docx', '.txt', '.xlsx']);

/* ── Try to load existing manifests to preserve custom descriptions ── */
function loadExisting(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

/* ── Generate display title from filename ── */
function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Detect category from filename for assets ── */
function categoryFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('teach') || lower.includes('class') || lower.includes('guru')) return 'Teaching';
  if (lower.includes('train') || lower.includes('stek') || lower.includes('education')) return 'Training';
  if (lower.includes('hack') || lower.includes('award') || lower.includes('certif') || lower.includes('winner')) return 'Achievement';
  return 'Professional';
}

/* ── Detect doc type from extension ── */
function typeFromExt(ext) {
  if (ext === '.pdf')  return 'pdf';
  if (ext === '.doc' || ext === '.docx') return 'doc';
  return 'file';
}

/* ── Build assets manifest ── */
function buildAssetsManifest() {
  const existing = loadExisting(path.join(ROOT, 'manifest.assets.json'));
  const existMap  = Object.fromEntries(existing.map(e => [e.filename, e]));

  const files = fs.readdirSync(ASSETS_DIR)
    .filter(f => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  return files.map(filename => {
    const prev = existMap[filename];
    const stat  = fs.statSync(path.join(ASSETS_DIR, filename));
    return {
      filename,
      title:       prev?.title       || titleFromFilename(filename),
      description: prev?.description || `Photo: ${titleFromFilename(filename)}`,
      category:    prev?.category    || categoryFromFilename(filename),
      sizeBytes:   stat.size,
    };
  });
}

/* ── Build docs manifest ── */
function buildDocsManifest() {
  const existing = loadExisting(path.join(ROOT, 'manifest.docs.json'));
  const existMap  = Object.fromEntries(existing.map(e => [e.filename, e]));

  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => DOC_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  return files.map(filename => {
    const ext  = path.extname(filename).toLowerCase();
    const prev = existMap[filename];
    const stat  = fs.statSync(path.join(DOCS_DIR, filename));
    return {
      filename,
      title:       prev?.title       || titleFromFilename(filename),
      description: prev?.description || `Document: ${titleFromFilename(filename)}`,
      type:        prev?.type        || typeFromExt(ext),
      sizeBytes:   stat.size,
      icon:        prev?.icon        || 'file-text',
    };
  });
}

/* ── Write manifests ── */
const assets = buildAssetsManifest();
const docs   = buildDocsManifest();

fs.writeFileSync(
  path.join(ROOT, 'manifest.assets.json'),
  JSON.stringify(assets, null, 2) + '\n',
);
console.log(`✅  manifest.assets.json — ${assets.length} file(s)`);

fs.writeFileSync(
  path.join(ROOT, 'manifest.docs.json'),
  JSON.stringify(docs, null, 2) + '\n',
);
console.log(`✅  manifest.docs.json   — ${docs.length} file(s)`);

console.log('\nDone! Open index.html in a browser to preview the site.');
