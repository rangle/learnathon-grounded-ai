'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [grounding, setGrounding] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    setGrounding(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnswer(data.answer);
        setGrounding(data.groundingMetadata);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 mb-4 tracking-tight">
            Grounded Q&A Chatbot
          </h1>
          <p className="text-lg text-primary-700">
            Ask me anything, and I'll provide grounded answers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your question..."
                className="flex-1 min-w-0 rounded-lg border-2 border-primary-100 px-4 py-3 text-primary-900 placeholder-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : 'Ask'}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {answer && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 transition-all">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">Answer</h3>
            <p className="text-primary-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
          </div>
        )}

        {grounding && (
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
            <h4 className="text-lg font-semibold text-primary-900 mb-4">Grounding Metadata</h4>
            <pre className="bg-white p-4 rounded-lg overflow-auto text-sm text-primary-700">
              {JSON.stringify(grounding, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
