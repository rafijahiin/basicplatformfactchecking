import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache results for 1 hour
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/verify-claim', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const cacheKey = `verify_${text.trim().toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const searchQuery = `${text} rumor fact check গুজব`;
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];

    const TRUSTED_DOMAINS = [
      'rumorscanner.com', 'factwatch.org', 'boomlive.in', 'afp.com',
      'factcheck.org', 'snopes.com', 'check4spam.com', 'altnews.in',
      'fullfact.org', 'politifact.com', 'reuters.com/fact-check', 'bbc.com/news/reality_check',
      'facebook.com/RumorScanner', 'facebook.com/FactWatch'
    ];

    const NEWS_DOMAINS = [
      'prothomalo.com', 'thedailystar.net', 'dhakatribune.com', 'bdnews24.com',
      'jagonews24.com', 'banglanews24.com', 'itvbd.com', 'somoynews.tv'
    ];

    $('.result').each((i, el) => {
      if (i < 12) {
        const title = $(el).find('.result__title').text().trim();
        const snippet = $(el).find('.result__snippet').text().trim();
        const link = $(el).find('.result__url').attr('href') || $(el).find('.result__url').text().trim();

        if (!title) return;

        let trustScore = 1; // Default
        if (TRUSTED_DOMAINS.some(d => link.toLowerCase().includes(d.toLowerCase()))) {
          trustScore = 10;
        } else if (NEWS_DOMAINS.some(d => link.toLowerCase().includes(d.toLowerCase()))) {
          trustScore = 5;
        } else if (link.includes('.gov') || link.includes('.edu')) {
          trustScore = 7;
        }

        results.push({ title, snippet, link, trustScore });
      }
    });

    // Sort by trust score
    results.sort((a, b) => b.trustScore - a.trustScore);

    const output = { results };
    cache.set(cacheKey, output);
    res.json(output);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
