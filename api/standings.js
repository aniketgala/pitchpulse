export default async function handler(req, res) {
  const { leagueCode } = req.query;
  const API_KEY = process.env.VITE_FOOTBALL_DATA_API_KEY;
  const BASE_URL = 'https://api.football-data.org/v4';

  if (!API_KEY) {
    return res.status(500).json({ error: 'Football Data API key not configured' });
  }

  if (!leagueCode) {
    return res.status(400).json({ error: 'League code is required' });
  }

  try {
    const response = await fetch(`${BASE_URL}/competitions/${leagueCode}/standings`, {
      headers: {
        'X-Auth-Token': API_KEY,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
}
