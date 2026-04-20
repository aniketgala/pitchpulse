import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getPredictions, 
  addPrediction, 
  deletePrediction, 
  updatePrediction,
  addComment,
  getComments
} from '../services/predictionService';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  MessageSquare, 
  Send, 
  X, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const Predictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    match: '',
    prediction: '',
    analysis: ''
  });
  const [error, setError] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPredictions();
      setPredictions(data);
    } catch (err) {
      setError('Failed to load predictions. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('You must be logged in to post a prediction.');

    try {
      setError(null);
      setSubmitting(true);
      if (editingId) {
        await updatePrediction(editingId, formData);
      } else {
        await addPrediction(user.uid, user.email, formData);
      }
      setFormData({ match: '', prediction: '', analysis: '' });
      setShowForm(false);
      setEditingId(null);
      fetchPredictions();
    } catch (err) {
      if (err.message?.includes('permission-denied')) {
        setError('Firebase Permission Denied. Please ensure your Firestore rules allow writes.');
      } else {
        setError(err.message || 'Operation failed. Check your connection or Firestore rules.');
      }
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      await deletePrediction(id);
      fetchPredictions();
    }
  };

  const startEdit = (p) => {
    setFormData({
      match: p.match,
      prediction: p.prediction,
      analysis: p.analysis
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  // Optimization: useMemo for filtering or sorting if needed
  const sortedPredictions = useMemo(() => {
    return [...predictions].sort((a, b) => {
      const dateA = a.createdAt?.seconds || Date.now() / 1000;
      const dateB = b.createdAt?.seconds || Date.now() / 1000;
      return dateB - dateA;
    });
  }, [predictions]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Match Predictions</h1>
            <p className="text-slate-600">Share your insights and see what others think.</p>
          </div>
          {user && (
            <button 
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({ match: '', prediction: '', analysis: '' });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Cancel' : 'New Prediction'}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Prediction' : 'Post a Prediction'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Match</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Arsenal vs Chelsea"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                    value={formData.match}
                    onChange={(e) => setFormData({...formData, match: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Score Prediction</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 2-1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                    value={formData.prediction}
                    onChange={(e) => setFormData({...formData, prediction: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Analysis</label>
                <textarea 
                  required
                  rows="3"
                  placeholder="Why do you think so?"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                  value={formData.analysis}
                  onChange={(e) => setFormData({...formData, analysis: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="bg-slate-900 text-white px-8 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {editingId ? (submitting ? 'Updating...' : 'Update') : (submitting ? 'Posting...' : 'Post Prediction')}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
            <p className="text-slate-500">Loading community insights...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPredictions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No predictions yet. Be the first to share one!</p>
              </div>
            ) : (
              sortedPredictions.map((p) => (
                <PredictionCard 
                  key={p.id} 
                  prediction={p} 
                  user={user} 
                  onEdit={startEdit} 
                  onDelete={handleDelete} 
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PredictionCard = ({ prediction, user, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(prediction.id);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, prediction.id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await addComment(prediction.id, user.uid, user.email, newComment.trim());
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <article className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
            {prediction.userEmail?.[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{prediction.userEmail}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {prediction.createdAt?.seconds 
                ? new Date(prediction.createdAt.seconds * 1000).toLocaleDateString()
                : 'Just now'}
            </div>
          </div>
        </div>
        {user && user.uid === prediction.userId && (
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(prediction)}
              className="p-2 hover:bg-yellow-50 text-slate-400 hover:text-yellow-600 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(prediction.id)}
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Match</span>
          <span className="font-bold text-slate-900">{prediction.match}</span>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Prediction</span>
          <span className="text-2xl font-black text-yellow-600">{prediction.prediction}</span>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed italic mb-4">
        "{prediction.analysis}"
      </p>

      <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {showComments ? 'Hide Comments' : 'Comments'}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-3">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-2">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">{comment.userEmail}</span>
                    <span className="text-[10px] text-slate-400">
                      {comment.createdAt?.seconds 
                        ? new Date(comment.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {user && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input 
                type="text"
                placeholder="Write a comment..."
                className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button 
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {submittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
};

export default Predictions;
