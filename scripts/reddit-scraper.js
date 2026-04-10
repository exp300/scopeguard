#!/usr/bin/env node
/**
 * Reddit scraper — uses the public JSON API (no auth required).
 * Fetches top posts about scope creep from several freelance/design subreddits,
 * extracts post titles, top comments, upvotes, and real user quotes, then writes
 * the raw data to scripts/reddit-data.json.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_PATH = join(__dirname, 'reddit-data.json');

const SEARCHES = [
  { subreddit: 'freelance',      query: 'scope creep' },
  { subreddit: 'freelance',      query: 'client asks extra work' },
  { subreddit: 'freelance',      query: 'out of scope' },
  { subreddit: 'webdev',         query: 'scope creep client' },
  { subreddit: 'web_design',     query: 'scope creep' },
  { subreddit: 'graphic_design', query: 'scope creep' },
];

const DELAY_MS = 1200; // be polite to the Reddit API

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ScopeGuardBlogBot/1.0 (content research; non-commercial)',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/**
 * Fetch top posts from a subreddit search and return structured post objects.
 */
async function scrapeSearch(subreddit, query, limit = 25) {
  const url =
    `https://www.reddit.com/r/${subreddit}/search.json` +
    `?q=${encodeURIComponent(query)}&sort=top&t=year&limit=${limit}&restrict_sr=1`;

  console.log(`  Fetching r/${subreddit} — "${query}" …`);
  const data = await fetchJson(url);
  const posts = data?.data?.children ?? [];

  const results = [];
  for (const { data: post } of posts) {
    if (post.is_video || post.stickied) continue;

    const item = {
      id: post.id,
      subreddit: post.subreddit,
      title: post.title,
      url: `https://www.reddit.com${post.permalink}`,
      score: post.score,
      num_comments: post.num_comments,
      selftext: (post.selftext || '').slice(0, 2000),
      created_utc: post.created_utc,
      top_comments: [],
    };

    // Fetch thread comments if the post has at least 3 comments
    if (post.num_comments >= 3) {
      try {
        await sleep(DELAY_MS);
        item.top_comments = await fetchTopComments(post.id, subreddit);
      } catch (err) {
        console.warn(`    Could not fetch comments for ${post.id}: ${err.message}`);
      }
    }

    results.push(item);
    await sleep(DELAY_MS);
  }
  return results;
}

/**
 * Fetch the top-level comments for a post and return the 5 highest-voted ones.
 */
async function fetchTopComments(postId, subreddit) {
  const url =
    `https://www.reddit.com/r/${subreddit}/comments/${postId}.json` +
    `?sort=top&limit=10&depth=1`;

  const data = await fetchJson(url);
  const commentListing = data?.[1]?.data?.children ?? [];

  return commentListing
    .filter((c) => c.kind === 't1' && c.data.body && c.data.body !== '[deleted]')
    .sort((a, b) => b.data.score - a.data.score)
    .slice(0, 5)
    .map((c) => ({
      id: c.data.id,
      body: c.data.body.slice(0, 1000),
      score: c.data.score,
      author_flair: c.data.author_flair_text || null,
    }));
}

async function main() {
  console.log('Reddit scraper starting…\n');

  const allPosts = [];
  const seen = new Set();

  for (const { subreddit, query } of SEARCHES) {
    try {
      const posts = await scrapeSearch(subreddit, query);
      for (const post of posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          allPosts.push(post);
        }
      }
      console.log(`  → ${posts.length} posts (${seen.size} unique so far)\n`);
    } catch (err) {
      console.error(`  ✗ Error scraping r/${subreddit} "${query}": ${err.message}\n`);
    }
    await sleep(DELAY_MS * 2);
  }

  // Sort by score descending
  allPosts.sort((a, b) => b.score - a.score);

  const output = {
    scraped_at: new Date().toISOString(),
    total_posts: allPosts.length,
    searches: SEARCHES,
    posts: allPosts,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nDone. ${allPosts.length} unique posts saved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
