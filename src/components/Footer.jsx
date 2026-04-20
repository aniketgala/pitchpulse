import React from 'react';
import { Trophy, Globe, Mail } from 'lucide-react';

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Trophy className="w-6 h-6 text-yellow-500 group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold tracking-tighter text-white">
                PitchPulse
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your personalized hub for the beautiful game. Real-time news, transfer updates, and score predictions.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Leagues</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/leagues/premier-league" className="hover:text-yellow-500 transition-colors">Premier League</Link></li>
              <li><Link to="/leagues/la-liga" className="hover:text-yellow-500 transition-colors">La Liga</Link></li>
              <li><Link to="/leagues/champions-league" className="hover:text-yellow-500 transition-colors">Champions League</Link></li>
              <li><Link to="/leagues/bundesliga" className="hover:text-yellow-500 transition-colors">Bundesliga</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/news" className="hover:text-yellow-500 transition-colors">Latest News</Link></li>
              <li><Link to="/transfers" className="hover:text-yellow-500 transition-colors">Transfer Center</Link></li>
              <li><Link to="/predictions" className="hover:text-yellow-500 transition-colors">Predict & Win</Link></li>
              <li><Link to="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-500 transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-yellow-500 transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
            <div className="mt-6">
              <p className="text-xs">© 2026 PitchPulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
