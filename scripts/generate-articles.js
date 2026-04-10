#!/usr/bin/env node
/**
 * Article generator — reads reddit-data.json, selects the most useful posts,
 * and calls the Google Gemini API to write SEO articles that weave in real
 * Reddit quotes (anonymised as "one freelancer shared…").
 *
 * Outputs scripts/generated-articles.json.
 *
 * Requires: GEMINI_API_KEY in environment (or .env file at repo root).
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_PATH  = join(__dirname, 'reddit-data.json');
const OUTPUT_PATH = join(__dirname, 'generated-articles.json');
const ROOT_ENV    = resolve(__dirname, '..', '.env');

// Load .env from repo root if present
if (existsSync(ROOT_ENV)) {
  const lines = readFileSync(ROOT_ENV, 'utf8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------------------------------------------------------
// Article definitions — each entry describes one piece to write
// ---------------------------------------------------------------------------
const ARTICLES = [
  {
    slug: 'scope-creep-red-flags-freelancers-miss',
    title: 'Scope Creep Red Flags Most Freelancers Miss (Until It\'s Too Late)',
    keyword: 'scope creep red flags',
    metaDescription:
      'The early warning signs of scope creep that most freelancers overlook — and how to spot them before a project gets out of hand.',
    angle:
      'Identify the subtle, early signs that a project is about to expand beyond its scope. Use Reddit posts as evidence for each warning sign.',
  },
  {
    slug: 'how-to-write-a-freelance-change-order',
    title: 'How to Write a Freelance Change Order (Template + Examples)',
    keyword: 'freelance change order template',
    metaDescription:
      'A simple, professional change order template for freelancers, with real examples and word-for-word language you can copy today.',
    angle:
      'Walk through exactly how to write, send, and get approval for a change order. Include a ready-to-copy template and explain why each part matters.',
  },
  {
    slug: 'scope-creep-web-development-projects',
    title: 'Scope Creep in Web Development: Why It Happens and How to Stop It',
    keyword: 'scope creep web development',
    metaDescription:
      'Web developers face unique scope creep patterns. Here\'s why it happens so often and the specific tactics that work to prevent it.',
    angle:
      'Focus specifically on web development scope creep patterns (feature additions, browser support requests, CMS changes, etc.) with evidence from r/webdev.',
  },
  {
    slug: 'client-communication-scope-boundaries',
    title: 'How to Communicate Project Boundaries to Clients (Without the Awkward Conversation)',
    keyword: 'freelance client communication scope',
    metaDescription:
      'Setting clear project boundaries with clients before work starts — the exact language and approach that prevents scope creep from starting.',
    angle:
      'Focus on proactive communication: setting expectations at the proposal stage, kick-off, and mid-project. Use Reddit examples of what goes wrong when this is skipped.',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Pick the top N most relevant posts for an article based on keyword overlap.
 */
function selectRelevantPosts(allPosts, angle, n = 8) {
  const words = angle.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
  const scored = allPosts.map((post) => {
    const text = `${post.title} ${post.selftext}`.toLowerCase();
    const score = words.reduce((sum, w) => sum + (text.includes(w) ? 1 : 0), 0) + post.score / 5000;
    return { post, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.post);
}

/**
 * Build a compact "research brief" string from selected posts to include in the prompt.
 */
function buildResearchBrief(posts) {
  return posts
    .map((p, i) => {
      const commentLines = p.top_comments
        .slice(0, 3)
        .map((c) => `    • [${c.score} upvotes] "${c.body.replace(/\n+/g, ' ').slice(0, 300)}"`)
        .join('\n');
      return [
        `--- Post ${i + 1} (r/${p.subreddit}, ${p.score} upvotes) ---`,
        `Title: ${p.title}`,
        p.selftext ? `Body: ${p.selftext.replace(/\n+/g, ' ').slice(0, 400)}` : '',
        commentLines ? `Top comments:\n${commentLines}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
}

/**
 * Call Gemini to write an article.
 */
async function generateArticle(articleDef, posts) {
  const brief = buildResearchBrief(posts);

  const prompt = `You are an expert SEO content writer specialising in freelancing, contracts, and client management.
You write in a clear, direct, practical style — no fluff, no padding, real advice that freelancers can apply today.
Your articles are optimised for search engines but written for humans first.

Write a long-form SEO article for the ScopeGuard blog (scopeguard.io — an AI tool that helps freelancers detect scope creep by analysing contracts and client messages).

**Article spec:**
- Title: ${articleDef.title}
- Target keyword: "${articleDef.keyword}" (use naturally in H1, one H2, meta, and 2–3 times in body)
- Angle: ${articleDef.angle}
- Length: 900–1200 words
- Format: HTML (h1, h2, p, ul, ol, blockquote, strong, em, a tags only — no CSS, no divs)

**Requirements:**
1. Use at least 3 real quotes from the Reddit research below, anonymised as "one freelancer shared…", "a web developer on Reddit noted…", "as one commenter put it…", etc. Do NOT attribute to a username — paraphrase or lightly edit for grammar while keeping the authentic voice.
2. Mention ScopeGuard naturally once or twice as a practical tool — link as <a href="https://scopeguard.io">ScopeGuard</a>. Do not sound promotional; present it as one practical resource among several.
3. Every H2 section must deliver standalone value — a reader skimming headers should get the gist.
4. End with a short, punchy summary or action list.
5. Write the full article — no placeholders, no [insert example here].

**Reddit research:**
${brief}

Output only the HTML article content, starting with <h1> and ending with the last </p> or </ul>. No markdown, no code fences, no preamble.`;

  console.log(`  Calling Gemini for: "${articleDef.title}" …`);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const result = await model.generateContent(prompt);
  const content = result.response.text() ?? '';
  return content.trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!existsSync(INPUT_PATH)) {
    console.error(`reddit-data.json not found at ${INPUT_PATH}`);
    console.error('Run: node scripts/reddit-scraper.js first');
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(INPUT_PATH, 'utf8'));
  const allPosts = raw.posts ?? [];
  console.log(`Loaded ${allPosts.length} posts from reddit-data.json\n`);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const generatedArticles = [];

  for (const articleDef of ARTICLES) {
    try {
      const posts = selectRelevantPosts(allPosts, `${articleDef.angle} ${articleDef.keyword}`);
      const htmlContent = await generateArticle(articleDef, posts);

      // Rough reading time estimate
      const wordCount = htmlContent.replace(/<[^>]+>/g, ' ').split(/\s+/).length;
      const readingTime = `${Math.max(3, Math.ceil(wordCount / 220))} min read`;

      generatedArticles.push({
        slug: articleDef.slug,
        title: articleDef.title,
        metaDescription: articleDef.metaDescription,
        date: dateStr,
        readingTime,
        keyword: articleDef.keyword,
        content: `\n${htmlContent}\n`,
        generated_at: new Date().toISOString(),
      });

      console.log(`  ✓ Done (${wordCount} words, ${readingTime})\n`);
    } catch (err) {
      console.error(`  ✗ Failed to generate "${articleDef.title}": ${err.message}\n`);
    }

    // Brief pause between API calls
    await new Promise((r) => setTimeout(r, 500));
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(generatedArticles, null, 2));
  console.log(`\n${generatedArticles.length} articles saved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
