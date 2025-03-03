'use client';

import { useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';

// Define a more specific type for the grounding metadata
type GroundingMetadata = {
  groundingSnippets?: Array<{
    url?: string;
    content?: string;
    title?: string;
  }>;
  searchQueries?: string[];
  // Add other expected properties as needed
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [grounding, setGrounding] = useState<GroundingMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setAnswer('');
    setGrounding(null);
    setCurrentQuestion(query);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnswer(data.answer);
        setGrounding(data.groundingMetadata);
      }
    } catch (error: unknown) {
      // Using the error parameter without referencing it directly
      console.error('Error fetching answer:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setQuery(''); // Reset the input field after submission
    }
  };

  const handleClearInput = () => {
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-900 mb-4 tracking-tight">
            Grounded Q&A Chatbot
          </h1>
          <p className="text-lg text-primary-700">
            Ask me anything, and I&apos;ll provide grounded answers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your question..."
                  className="w-full rounded-lg border-2 border-primary-100 px-4 py-3 text-primary-900 placeholder-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all pr-10"
                  required
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
                    aria-label="Clear input"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Ask'
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {currentQuestion && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 transition-all">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Your Question
            </h3>
            <p className="text-primary-800 leading-relaxed">
              {currentQuestion}
            </p>
          </div>
        )}

        {answer && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8 transition-all">
            <h3 className="text-xl font-semibold text-primary-900 mb-4">
              Answer
            </h3>
            <div className="text-primary-800 leading-relaxed prose prose-primary max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}

        {grounding && (
          <div className="bg-primary-50 rounded-2xl p-6 border border-primary-200">
            <h4 className="text-lg font-semibold text-primary-900 mb-4">
              Grounding Metadata
            </h4>
            <pre className="bg-white p-4 rounded-lg overflow-auto text-sm text-primary-700">
              {JSON.stringify(grounding, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
