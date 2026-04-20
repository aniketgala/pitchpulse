import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleById } from '../services/newsService';
import { Clock, User, ArrowLeft, MessageSquare, Share2, ThumbsUp, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Article not found</h2>
        <Link to="/" className="text-yellow-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to News
        </Link>
        
        <div className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mb-4">
          {article.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <div className="flex items-center justify-between py-6 border-y border-slate-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{article.author}</p>
              <div className="flex items-center gap-3 text-slate-500 text-sm">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.time}</span>
                <span>•</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-8 border-l-4 border-yellow-500 pl-6 py-2">
            {article.excerpt}
          </p>
          <div className="text-slate-800 leading-loose space-y-6">
            {article.id.toString().startsWith('api-') ? (
              <>
                <p>{article.content?.split('[+')[0] || 'Full content unavailable for this preview.'}</p>
                {article.url && (
                  <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 mt-8">
                    <p className="text-sm text-slate-600 mb-4 font-medium">
                      This article is curated from our news partner. Continue reading the full story on their official website.
                    </p>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all"
                    >
                      Read Full Article <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Tactical Breakdown</h3>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Interaction Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-slate-600 hover:text-yellow-600 font-bold transition-colors">
              <ThumbsUp className="w-5 h-5" />
              <span>{article.likes} Likes</span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 hover:text-yellow-600 font-bold transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>{article.comments} Comments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
