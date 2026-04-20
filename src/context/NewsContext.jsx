import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNews } from '../services/newsService';

const NewsContext = createContext();

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async (category) => {
    try {
      setLoading(true);
      const data = await getNews(category);
      setNews(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeCategory);
  }, [activeCategory]);

  const filteredNews = React.useMemo(() => {
    if (!searchTerm) return news;
    return news.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  const value = {
    news: filteredNews,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    refreshNews: () => fetchNews(activeCategory)
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};
