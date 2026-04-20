const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_API_KEY;
const BASE_URL = 'https://api.football-data.org/v4';
// Using a more reliable CORS proxy that forwards headers
const PROXY_URL = 'https://corsproxy.io/?';

export const getStandings = async (leagueCode) => {
  try {
    if (!API_KEY || API_KEY === 'your_football_data_api_key') {
      throw new Error('API Key missing');
    }

    const targetUrl = `${BASE_URL}/competitions/${leagueCode}/standings`;
    console.log(`Fetching standings from: ${targetUrl}`);
    
    const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch standings: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.standings && data.standings.length > 0) {
      // Find the TOTAL standings table
      const totalStanding = data.standings.find(s => s.type === 'TOTAL');
      const table = totalStanding ? totalStanding.table : (data.standings[0].table || []);
      
      if (!table || table.length === 0) {
        throw new Error('Empty standings table');
      }

      return table.map(item => ({
        rank: item.position,
        team: item.team.shortName || item.team.name,
        logo: item.team.crest,
        played: item.playedGames,
        points: item.points,
        form: item.form || 'N/A',
        won: item.won,
        draw: item.draw,
        lost: item.lost,
        goalsDiff: item.goalDifference
      }));
    }
    throw new Error('No standings data found');
  } catch (error) {
    console.error("Error fetching football-data.org standings:", error);
    // Return mock data if API fails
    return MOCK_STANDINGS[leagueCode] || null;
  }
};

const MOCK_STANDINGS = {
  'PL': [
    { rank: 1, team: 'Liverpool', played: 28, points: 64, form: 'WWWDW', won: 19, draw: 7, lost: 2, goalsDiff: 39 },
    { rank: 2, team: 'Man City', played: 28, points: 63, form: 'WWWDD', won: 19, draw: 6, lost: 3, goalsDiff: 35 },
    { rank: 3, team: 'Arsenal', played: 28, points: 61, form: 'WWWWW', won: 19, draw: 4, lost: 5, goalsDiff: 46 },
    { rank: 4, team: 'Aston Villa', played: 29, points: 56, form: 'WWLWL', won: 17, draw: 5, lost: 7, goalsDiff: 18 },
    { rank: 5, team: 'Tottenham', played: 28, points: 53, form: 'WLWWL', won: 16, draw: 5, lost: 7, goalsDiff: 20 },
  ],
  'PD': [
    { rank: 1, team: 'Real Madrid', played: 29, points: 72, form: 'WWDWW', won: 22, draw: 6, lost: 1, goalsDiff: 44 },
    { rank: 2, team: 'Barcelona', played: 29, points: 64, form: 'WDWWW', won: 19, draw: 7, lost: 3, goalsDiff: 26 },
    { rank: 3, team: 'Girona', played: 29, points: 62, form: 'WLWLW', won: 19, draw: 5, lost: 5, goalsDiff: 25 },
    { rank: 4, team: 'Atl. Madrid', played: 29, points: 55, form: 'LWLWW', won: 17, draw: 4, lost: 8, goalsDiff: 19 },
  ]
};

// Map for football-data.org league codes
export const LEAGUE_MAP = {
  'PL': 'PL',   // Premier League
  'PD': 'PD',   // La Liga
  'SA': 'SA',   // Serie A
  'BL1': 'BL1', // Bundesliga
  'FL1': 'FL1', // Ligue 1
  'CL': 'CL'    // Champions League
};
