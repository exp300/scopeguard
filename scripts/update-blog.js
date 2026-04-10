#!/usr/bin/env node
/**
 * Blog updater — reads generated-articles.json and merges the new articles into
 * frontend/src/data/blogPosts.js without removing existing entries.
 *
 * Articles that share a slug with an existing post are skipped (no overwrites).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_PATH  = join(__dirname, 'generated-articles.json');
const BLOG_PATH   = resolve(__dirname, '..', 'frontend', 'src', 'data', 'blogPosts.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract the current slug list from the existing blogPosts.js so we know
 * which slugs are already present — without importing the module (avoids JSX
 * module resolution complexity).
 */
function extractExistingSlugs(source) {
  const slugs = new Set();
  for (const match of source.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)) {
    slugs.add(match[1]);
  }
  return slugs;
}

/**
 * Serialise a single article object to the JS literal format used in blogPosts.js.
 * Content is written as a template literal to preserve HTML safely.
 */
function serialiseArticle(article) {
  const escape = (s) => (s ?? '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  return `  {
    slug: '${article.slug}',
    title: '${article.title.replace(/'/g, "\\'")}',
    metaDescription:
      '${article.metaDescription.replace(/'/g, "\\'")}',
    date: '${article.date}',
    readingTime: '${article.readingTime}',
    content: \`${escape(article.content)}\`,
  }`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  if (!existsSync(INPUT_PATH)) {
    console.error(`generated-articles.json not found at ${INPUT_PATH}`);
    console.error('Run: node scripts/generate-articles.js first');
    process.exit(1);
  }

  if (!existsSync(BLOG_PATH)) {
    console.error(`blogPosts.js not found at ${BLOG_PATH}`);
    process.exit(1);
  }

  const newArticles = JSON.parse(readFileSync(INPUT_PATH, 'utf8'));
  const existingSource = readFileSync(BLOG_PATH, 'utf8');
  const existingSlugs = extractExistingSlugs(existingSource);

  const toAdd = newArticles.filter((a) => {
    if (existingSlugs.has(a.slug)) {
      console.log(`  Skipping existing slug: ${a.slug}`);
      return false;
    }
    return true;
  });

  if (toAdd.length === 0) {
    console.log('No new articles to add — all slugs already exist in blogPosts.js');
    return;
  }

  // Find the closing `];` of the blogPosts array and insert before it
  const insertionPoint = existingSource.lastIndexOf('];');
  if (insertionPoint === -1) {
    console.error('Could not find closing `];` in blogPosts.js');
    process.exit(1);
  }

  const newEntries = toAdd.map(serialiseArticle).join(',\n\n');
  const updated =
    existingSource.slice(0, insertionPoint) +
    '\n\n' + newEntries + ',\n' +
    existingSource.slice(insertionPoint);

  writeFileSync(BLOG_PATH, updated);
  console.log(`Added ${toAdd.length} article(s) to blogPosts.js:`);
  for (const a of toAdd) console.log(`  + ${a.slug}`);
}

main();
