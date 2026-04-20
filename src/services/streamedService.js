const BASE_URL = 'https://streamed.pk/api';
const PROXY_URL = 'https://corsproxy.io/?';

export const getLiveMatches = async () => {
  try {
    const targetUrl = `${BASE_URL}/matches/live`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
};

export const getTodayMatches = async () => {
  try {
    const targetUrl = `${BASE_URL}/matches/all-today`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    return [];
  }
};

export const getSports = async () => {
  try {
    const targetUrl = `${BASE_URL}/sports`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching sports:", error);
    return [];
  }
};

export const getMatchesBySport = async (sport = 'football') => {
  try {
    const targetUrl = `${BASE_URL}/matches/${sport}`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${sport} matches:`, error);
    return [];
  }
};

export const getStreamLinks = async (source, id) => {
  try {
    const targetUrl = `${BASE_URL}/stream/${source}/${id}`;
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stream links:", error);
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
