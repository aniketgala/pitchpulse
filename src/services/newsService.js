// News API Configuration
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';
const PROXY_URL = 'https://corsproxy.io/?';

// Local cache to store fetched articles so they can be viewed by ID
let fetchedArticles = [];

// Mock data for initial development
const MOCK_NEWS = [
  {
    id: 1,
    title: "Real Madrid's New Transfer Strategy Revealed",
    excerpt: "The Spanish giants are looking to shift their focus towards younger talent from South America in the upcoming window...",
    content: "Full content about Real Madrid's strategy...",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    category: "Transfers",
    time: "2h ago",
    author: "Fabrizio Romano",
    comments: 124,
    likes: 450,
    featured: true
  },
  {
    id: 2,
    title: "Haaland Breaks Another Premier League Record",
    excerpt: "Erling Haaland's hat-trick against Liverpool has shattered the previous record for the most goals in a single month...",
    content: "Full content about Erling Haaland's hat-trick...",
    image: "https://images.unsplash.com/photo-1518091043644-c1d445f063d1?auto=format&fit=crop&q=80&w=800",
    category: "Premier League",
    time: "4h ago",
    author: "David Ornstein",
    comments: 89,
    likes: 320,
    featured: false
  },
  {
    id: 3,
    title: "Tactical Analysis: Klopp's New 3-4-3 System",
    excerpt: "A deep dive into the tactical shift that has revitalized Liverpool's midfield dominance this season...",
    content: "Full tactical analysis content...",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    category: "Tactics",
    time: "6h ago",
    author: "The Athletic",
    comments: 45,
    likes: 150,
    featured: false
  }
];

export const getNews = async (category = 'All') => {
  try {
    // If we have a real API key, fetch from NewsAPI.org
    if (NEWS_API_KEY && NEWS_API_KEY !== 'your_news_api_key') {
      // Improved query to filter out American Football and Rugby
      const excludeTerms = '-NFL -"American Football" -rugby -SuperBowl';
      const query = category === 'All' 
        ? `(football OR soccer) ${excludeTerms}` 
        : `(football OR soccer) ${category} ${excludeTerms}`;
      
      const targetUrl = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        const articles = data.articles.map((article, index) => ({
          id: `api-${index}`, // Use a prefix to distinguish from mock IDs
          title: article.title,
          excerpt: article.description,
          content: article.content,
          image: article.urlToImage || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
          category: category === 'All' ? 'Latest' : category,
          time: new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: article.author || 'PitchPulse Staff',
          comments: Math.floor(Math.random() * 50),
          likes: Math.floor(Math.random() * 200),
          url: article.url
        }));
        
        // Update local cache
        fetchedArticles = articles;
        return articles;
      }
    }

    // Fallback to Mock Data
    await new Promise(resolve => setTimeout(resolve, 500));
    if (category === 'All') return MOCK_NEWS;
    return MOCK_NEWS.filter(item => item.category === category);
  } catch (error) {
    console.error("Error fetching news:", error);
    return MOCK_NEWS;
  }
};

export const getArticleById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 1. Check fetched articles from API first
  const apiFound = fetchedArticles.find(item => item.id === id);
  if (apiFound) return apiFound;

  // 2. Fallback to mock data
  const mockFound = MOCK_NEWS.find(item => item.id === parseInt(id));
  return mockFound || MOCK_NEWS[0];
};
