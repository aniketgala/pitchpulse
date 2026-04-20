export default async function handler(req, res) {
  const { category = 'All' } = req.query;
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
  const BASE_URL = 'https://newsapi.org/v2';

  if (!NEWS_API_KEY) {
    return res.status(500).json({ error: 'News API key not configured' });
  }

  const excludeTerms = '-NFL -"American Football" -rugby -SuperBowl';
  const query = category === 'All' 
    ? `(football OR soccer) ${excludeTerms}` 
    : `(football OR soccer) ${category} ${excludeTerms}`;

  try {
    const response = await fetch(
      `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
}
