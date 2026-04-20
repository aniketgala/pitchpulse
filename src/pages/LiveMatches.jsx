import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Tv, 
  Clock, 
  ExternalLink, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Trophy,
  Filter,
  Calendar
} from 'lucide-react';
import { 
  getMatchesBySport, 
  getBadgeUrl, 
  getMatchStatus
} from '../services/streamedService';

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [viewMode, setViewMode] = useState('live'); // 'live' or 'today'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMatches = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else {
        setLoading(true);
        setMatches([]); // Clear matches when switching modes for better UX
      }
      
      let data;
      if (viewMode === 'live') {
        // Fetch ALL live matches and filter for football/soccer
        const liveData = await getMatchesBySport('football');
        data = liveData.filter(m => {
          const status = getMatchStatus(m.date);
          return status === 'Live' || status === 'Starting Soon';
        });
      } else {
        // Today mode: Fetch football matches specifically
        data = await getMatchesBySport('football');
      }
      
      if (!data || !Array.isArray(data)) {
        setMatches([]);
        return;
      }

      setMatches(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [viewMode]);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(true), 300000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Tv className="w-8 h-8 text-yellow-500" />
              Live Streams
            </h1>
            <p className="text-slate-600">Watch live matches from around the world.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              <button 
                onClick={() => setViewMode('live')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'live' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Tv className="w-3.5 h-3.5" />
                Live Now
              </button>
              <button 
                onClick={() => setViewMode('today')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'today' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Today's Schedule
              </button>
            </div>
            <button 
              onClick={() => fetchMatches(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-yellow-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Scanning the pitch for live action...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">
              {viewMode === 'live' ? "No live football matches right now" : "No football matches scheduled for today"}
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">Check back later for Champions League, Premier League, and other top competitions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const status = getMatchStatus(match.date);
              const isLive = status === 'Live';
              
              return (
                <div 
                  key={match.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
                >
                  {/* Status Ribbon */}
                  <div className="relative">
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      isLive ? 'bg-red-500 text-white animate-pulse' : 
                      status === 'Starting Soon' ? 'bg-yellow-500 text-slate-900' : 
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {isLive && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                      {status}
                    </div>
                    
                    <div className="h-40 bg-slate-900 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                      <div className="relative z-10 flex items-center gap-8 px-6">
                        <div className="flex flex-col items-center gap-2 w-20">
                          <img 
                            src={getBadgeUrl(match.teams?.home?.badge)} 
                            alt={match.teams?.home?.name} 
                            className="w-12 h-12 object-contain filter drop-shadow-lg"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=H'}
                          />
                          <span className="text-[10px] font-bold text-white text-center line-clamp-1">{match.teams?.home?.name}</span>
                        </div>
                        <div className="text-yellow-500 font-black text-xl italic">VS</div>
                        <div className="flex flex-col items-center gap-2 w-20">
                          <img 
                            src={getBadgeUrl(match.teams?.away?.badge)} 
                            alt={match.teams?.away?.name} 
                            className="w-12 h-12 object-contain filter drop-shadow-lg"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=A'}
                          />
                          <span className="text-[10px] font-bold text-white text-center line-clamp-1">{match.teams?.away?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-4 line-clamp-1 group-hover:text-yellow-600 transition-colors">
                      {match.title}
                    </h3>
                    
                    <div className="space-y-2">
                      {match.sources?.slice(0, 2).map((source, idx) => (
                        <a
                          key={idx}
                          href={`https://streamed.pk/watch/${source.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            isLive 
                              ? 'bg-slate-900 text-white hover:bg-yellow-500 hover:text-slate-900' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                          onClick={(e) => !isLive && e.preventDefault()}
                        >
                          <span className="flex items-center gap-2">
                            <Play className={`w-4 h-4 ${isLive ? 'fill-current' : ''}`} />
                            Server {idx + 1}
                          </span>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
