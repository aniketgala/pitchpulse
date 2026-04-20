export default async function handler(req, res) {
  const { endpoint = 'matches/live' } = req.query;
  const BASE_URL = 'https://streamed.pk/api';

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live matches' });
  }
}
