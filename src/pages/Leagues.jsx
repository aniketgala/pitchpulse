import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Star, ChevronRight, Loader2, Search, X, AlertCircle } from 'lucide-react';
import { getStandings, LEAGUE_MAP } from '../services/leaguesService';

const MOCK_LEAGUES = [
  { id: 'PL', name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', rank: 1 },
  { id: 'PD', name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', rank: 2 },
  { id: 'SA', name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', rank: 3 },
  { id: 'BL1', name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', rank: 4 },
  { id: 'FL1', name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', rank: 5 },
  { id: 'CL', name: 'Champions League', country: 'Europe', logo: 'https://media.api-sports.io/football/leagues/2.png', rank: 0 },
];

const MOCK_STANDINGS = {
  'PL': [
    { rank: 1, team: 'Liverpool', played: 28, points: 64, form: 'WWWDW' },
    { rank: 2, team: 'Man City', played: 28, points: 63, form: 'WWWDD' },
    { rank: 3, team: 'Arsenal', played: 28, points: 61, form: 'WWWWW' },
    { rank: 4, team: 'Aston Villa', played: 29, points: 56, form: 'WWLWL' },
    { rank: 5, team: 'Tottenham', played: 28, points: 53, form: 'WLWWL' },
  ],
  'PD': [
    { rank: 1, team: 'Real Madrid', played: 29, points: 72, form: 'WWDWW' },
    { rank: 2, team: 'Barcelona', played: 29, points: 64, form: 'WDWWW' },
    { rank: 3, team: 'Girona', played: 29, points: 62, form: 'WLWLW' },
    { rank: 4, team: 'Atl. Madrid', played: 29, points: 55, form: 'LWLWW' },
  ],
  'SA': [
    { rank: 1, team: 'Inter Milan', played: 29, points: 75, form: 'WWWWW' },
    { rank: 2, team: 'AC Milan', played: 29, points: 62, form: 'WWWWD' },
    { rank: 3, team: 'Juventus', played: 29, points: 59, form: 'DDLDW' },
    { rank: 4, team: 'Bologna', played: 29, points: 54, form: 'WLWWW' },
  ],
  'FL1': [
    { rank: 1, team: 'PSG', played: 26, points: 59, form: 'DDDWW' },
    { rank: 2, team: 'Brest', played: 26, points: 47, form: 'WWLDW' },
    { rank: 3, team: 'Monaco', played: 26, points: 46, form: 'WDLWD' },
    { rank: 4, team: 'Lille', played: 26, points: 43, form: 'LWWDL' },
  ],
  'BL1': [
    { rank: 1, team: 'Bayer Leverkusen', played: 26, points: 70, form: 'WWWWW' },
    { rank: 2, team: 'Bayern Munich', played: 26, points: 60, form: 'WDLWW' },
    { rank: 3, team: 'Stuttgart', played: 26, points: 56, form: 'WWDWW' },
    { rank: 4, team: 'Dortmund', played: 26, points: 50, form: 'LWWWW' },
  ]
};

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsError, setStandingsError] = useState(null);

  useEffect(() => {
    // Simulate API fetch for leagues list
    const fetchLeagues = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLeagues(MOCK_LEAGUES);
      setLoading(false);
    };
    fetchLeagues();
  }, []);

  const handleViewStandings = async (league) => {
    setSelectedLeague(league);
    setStandings([]);
    setStandingsError(null);
    
    const apiId = LEAGUE_MAP[league.id];
    if (apiId) {
      setStandingsLoading(true);
      try {
        const data = await getStandings(apiId);
        if (data && data.length > 0) {
          setStandings(data);
          setStandingsError(null);
        } else {
          // If service returns null, use component's local mock as last resort
          setStandings(MOCK_STANDINGS[league.id] || MOCK_STANDINGS['PL']);
          setStandingsError("Showing offline data.");
        }
      } catch (err) {
        // Handle rate limiting (429) or other API errors
        const isRateLimited = err.message.includes('429');
        setStandings(MOCK_STANDINGS[league.id] || MOCK_STANDINGS['PL']);
        
        if (isRateLimited) {
          setStandingsError("API Rate Limit Reached (10 req/min). Showing offline data. Please wait 1 minute before retrying.");
        } else {
          setStandingsError("Could not fetch live data. Showing offline data. Check your API key or connection.");
        }
      } finally {
        setStandingsLoading(false);
      }
    }
  };

  const filteredLeagues = useMemo(() => {
    return leagues.filter(league => 
      league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leagues, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Football Leagues
            </h1>
            <p className="text-slate-600">Explore standings and statistics from the world's top competitions.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search leagues..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white focus:ring-2 focus:ring-yellow-500 outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading competitions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeagues.map((league) => (
              <div 
                key={league.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                    <img src={league.logo} alt={league.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  {league.rank === 0 && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Premium
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-yellow-600 transition-colors">
                  {league.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {league.country}
                </p>
                
                <button 
                  onClick={() => handleViewStandings(league)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  View Standings
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Standings Modal */}
        {selectedLeague && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
              <div className="bg-slate-900 p-6 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center p-1.5 flex-shrink-0">
                    <img src={selectedLeague.logo} alt={selectedLeague.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-xl font-bold leading-none truncate">{selectedLeague.name}</h2>
                      {!standingsError && !standingsLoading && (
                        <span className="bg-green-500 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-black animate-pulse flex-shrink-0">LIVE</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-wider mt-1 truncate">{selectedLeague.country}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLeague(null)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="p-4 md:p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-slate-200">
                {standingsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Fetching live standings...</p>
                  </div>
                ) : (
                  <>
                    {standingsError && (
                      <div className="mb-4 bg-yellow-50 border border-yellow-100 text-yellow-700 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-[10px] md:text-xs">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{standingsError}</span>
                        </div>
                        <button 
                          onClick={() => handleViewStandings(selectedLeague)}
                          className="flex-shrink-0 bg-yellow-500 text-slate-900 px-3 py-1 rounded-lg font-bold text-[10px] hover:bg-yellow-600 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                      <table className="w-full text-left min-w-[400px] md:min-w-full">
                        <thead>
                          <tr className="text-slate-400 text-[10px] md:text-xs font-bold uppercase border-b border-slate-100">
                            <th className="pb-4 pl-4 md:pl-0 w-8 md:w-12">#</th>
                            <th className="pb-4">Team</th>
                            <th className="pb-4 text-center">PL</th>
                            <th className="pb-4 text-center">PTS</th>
                            <th className="pb-4 text-right pr-4 md:pr-0">Form / Stats</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {standings.map((team) => (
                            <tr key={team.rank} className="group hover:bg-slate-50 transition-colors text-sm md:text-base">
                              <td className="py-3 md:py-4 font-bold text-slate-400 pl-4 md:pl-0">{team.rank}</td>
                              <td className="py-3 md:py-4 font-bold text-slate-900 flex items-center gap-2 md:gap-3">
                                {team.logo && <img src={team.logo} alt="" className="w-5 h-5 md:w-6 md:h-6 object-contain flex-shrink-0" />}
                                <span className="truncate max-w-[100px] md:max-w-none">{team.team}</span>
                              </td>
                              <td className="py-3 md:py-4 text-center text-slate-600 font-medium">{team.played}</td>
                              <td className="py-3 md:py-4 text-center text-slate-900 font-black">{team.points}</td>
                              <td className="py-3 md:py-4 text-right pr-4 md:pr-0">
                                <div className="flex items-center justify-end gap-1">
                                  {team.form && team.form !== 'N/A' ? (
                                    team.form.split(',').map((res, i) => {
                                      const r = res.trim().charAt(0).toUpperCase();
                                      return (
                                        <span 
                                          key={i} 
                                          className={`w-4 h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white ${
                                            r === 'W' ? 'bg-green-500' : r === 'D' ? 'bg-slate-400' : 'bg-red-500'
                                          }`}
                                        >
                                          {r}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold">
                                      <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{team.won}W</span>
                                      <span className="text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{team.draw}D</span>
                                      <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{team.lost}L</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && filteredLeagues.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No leagues found</h3>
            <p className="text-slate-500">Try searching for something else.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leagues;
