import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy Loading Components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Predictions = lazy(() => import('./pages/Predictions'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Leagues = lazy(() => import('./pages/Leagues'));
const LiveMatches = lazy(() => import('./pages/LiveMatches'));

const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans selection:bg-yellow-200 selection:text-slate-900">
        <Navbar />
        
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/live" element={<LiveMatches />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/leagues" element={<Leagues />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
