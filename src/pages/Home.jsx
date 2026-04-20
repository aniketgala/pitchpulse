import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MessageSquare, Share2, TrendingUp, Star, Loader2, SearchX } from 'lucide-react';
import { useNews } from '../context/NewsContext';

const Home = () => {
  const { news, loading, error, activeCategory, setActiveCategory, searchTerm, setSearchTerm } = useNews();
  const navigate = useNavigate();

  const categories = ['All', 'Transfers', 'Premier League', 'La Liga', 'Tactics'];

  const handleTopicClick = (topic) => {
    setSearchTerm(topic.replace('#', ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-yellow-500 mb-4 animate-bounce">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold uppercase tracking-wider text-sm">Trending Now</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Stay Ahead of the <span className="text-yellow-500">Game</span>.
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Get the latest football news, expert analysis, and transfer rumors tailored just for you. Follow your favorite teams and never miss a beat.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-8 py-3 rounded-full font-bold transition-all hover:scale-105">
                Join PitchPulse
              </Link>
              <button 
                onClick={() => {
                  const feed = document.getElementById('news-feed');
                  feed?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition-all"
              >
                Explore News
              </button>
            </div>
          </div>
        </div>
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/10 skew-x-12 transform translate-x-20"></div>
      </section>

      {/* Main Feed */}
      <main id="news-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-bold text-slate-900">Latest Updates</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((tag) => (
              <button 
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === tag 
                    ? 'bg-yellow-500 text-slate-900' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-yellow-100 hover:text-yellow-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: News Feed */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Fetching the latest stories...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100">
                {error}
              </div>
            ) : news.length > 0 ? (
              news.map((item) => (
                <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row border border-slate-100">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-slate-400 text-xs mb-3">
                        <span className="flex items-center gap-1 font-semibold text-slate-600">
                          <Clock className="w-3 h-3" /> {item.time}
                        </span>
                        <span>By {item.author}</span>
                      </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors">
                      <Link to={`/article/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4 text-slate-400">
                      <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">{item.comments}</span>
                      </button>
                      <button className="hover:text-yellow-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Link 
                      to={`/article/${item.id}`}
                      className="text-yellow-600 font-bold text-sm hover:translate-x-1 transition-transform"
                    >
                      Read More →
                    </Link>
                  </div>
                   </div>
                 </article>
               ))
             ) : (
               <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 flex flex-col items-center">
                 {searchTerm ? (
                   <>
                     <SearchX className="w-12 h-12 text-slate-300 mb-4" />
                     <h3 className="text-lg font-bold text-slate-900 mb-1">No results for "{searchTerm}"</h3>
                     <p className="text-slate-500">Try adjusting your search or category.</p>
                   </>
                 ) : (
                   <p className="text-slate-500">No news found for this category.</p>
                 )}
               </div>
             )}
          </div>

          {/* Right Column: Sidebar */}
          <aside className="space-y-8">
            {/* Newsletter Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <Star className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Join the Club</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Get exclusive transfer rumors and match predictions directly to your inbox.
                </p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Thanks for joining the club! Check your inbox soon.');
                    e.target.reset();
                  }}
                  className="space-y-3"
                >
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500 transition-colors text-white"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 rounded-lg transition-all"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                Popular Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {['#TransferWindow', '#ChampionsLeague', '#BallonDor', '#PremierLeague', '#LaLiga', '#Euro2024'].map((tag) => (
                  <span 
                    key={tag}
                    onClick={() => handleTopicClick(tag)}
                    className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Home;
