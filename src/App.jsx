import React, { useState } from 'react';
import { Send, Baby, Heart, AlertCircle, Sparkles } from 'lucide-react';

export default function BabyGuideApp() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const commonQuestions = [
    "Why does my baby have a soft spot on their head?",
    "Is it normal for my baby to have rashes?",
    "How often should my newborn eat?",
    "Why does my baby cry so much?",
    "When will my baby sleep through the night?",
    "Is my baby's poop color normal?"
  ];

  const handleAskQuestion = async (userQuestion) => {
    if (!userQuestion.trim()) return;
    const newUserMessage = { id: Date.now(), type: 'user', text: userQuestion };
    setMessages(prev => [...prev, newUserMessage]);
    setQuestion('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAskQuestion(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="w-12 h-12 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TinyAnswers
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Your calm companion for parenting questions</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-purple-600">
            <Heart className="w-4 h-4" />
            <span>You're doing great!</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Sparkles className="w-16 h-16 text-purple-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ask me anything!</h2>
              <p className="text-gray-500 mb-8 max-w-md">From soft spots to sleep schedules, I'm here to help answer your baby care questions with kindness and clarity.</p>
              <div className="w-full max-w-2xl">
                <p className="text-sm font-medium text-gray-600 mb-3">Try asking about:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonQuestions.map((q, idx) => (
                    <button key={idx} onClick={() => handleAskQuestion(q)}
                      className="text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-sm text-gray-700 border border-purple-100">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Baby className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600">TinyAnswers</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4">
          <div className="flex gap-3">
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about your baby... (e.g., Why is there a soft spot?)"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading} />
            <button type="submit" disabled={isLoading || !question.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium">
              <Send className="w-4 h-4" />
              Ask
            </button>
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Important:</strong> This app provides general information and support. Always consult your pediatrician for medical advice specific to your baby's needs.
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/download.html" className="text-sm text-purple-600 hover:text-purple-800 underline">
            📱 Download iOS & macOS App
          </a>
        </div>
      </div>
    </div>
  );
}
