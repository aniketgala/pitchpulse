// Use internal Vercel Serverless Function to avoid CORS
const BASE_URL = '/api/matches';

export const getLiveMatches = async () => {
  try {
    const response = await fetch(`${BASE_URL}?endpoint=matches/live`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching live matches via internal API:", error);
    return [];
  }
};

export const getTodayMatches = async () => {
  try {
    const response = await fetch(`${BASE_URL}?endpoint=matches/all-today`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching today's matches via internal API:", error);
    return [];
  }
};

export const getSports = async () => {
  try {
    const response = await fetch(`${BASE_URL}?endpoint=sports`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching sports via internal API:", error);
    return [];
  }
};

export const getMatchesBySport = async (sport = 'football') => {
  try {
    const response = await fetch(`${BASE_URL}?endpoint=matches/${sport}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${sport} matches via internal API:`, error);
    return [];
  }
};

export const getStreamLinks = async (source, id) => {
  try {
    const response = await fetch(`${BASE_URL}?endpoint=stream/${source}/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stream links via internal API:", error);
    return null;
  }
};

export const getBadgeUrl = (badge) => {
  if (!badge) return '';
  return `https://streamed.pk/api/images/badge/${badge}.webp`;
};

export const getPosterUrl = (poster) => {
  if (!poster) return '';
  return `https://streamed.pk/api/images/poster/${poster}`;
};

export const getMatchStatus = (date) => {
  const now = new Date();
  const matchDate = new Date(date);
  const diffHours = (matchDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < -2) return 'Ended';
  if (diffHours < 0 && diffHours > -2) return 'Live';
  if (diffHours < 2) return 'Starting Soon';
  return 'Upcoming';
};
