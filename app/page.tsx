'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [stats, setStats] = useState({ photos: 0, videos: 0, messages: 0, calls: 0 });

  useEffect(() => {
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
      fetchStats(savedKey);
    }
  }, []);

  const handleSaveConfig = () => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
      setIsConfigured(true);
      fetchStats(apiKey);
    }
  };

  const fetchStats = async (key: string) => {
    try {
      const [photos, videos, messages, calls] = await Promise.all([
        fetch('/api/photos', { headers: { 'X-API-Key': key } }).then(r => r.json()),
        fetch('/api/videos', { headers: { 'X-API-Key': key } }).then(r => r.json()),
        fetch('/api/sms', { headers: { 'X-API-Key': key } }).then(r => r.json()),
        fetch('/api/calls', { headers: { 'X-API-Key': key } }).then(r => r.json()),
      ]);
      setStats({
        photos: Array.isArray(photos) ? photos.length : 0,
        videos: Array.isArray(videos) ? videos.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        calls: Array.isArray(calls) ? calls.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Phone Monitor
          </h1>
          <p className="text-gray-300 text-lg">Monitor your device remotely from anywhere</p>
          <p className="text-gray-400 text-sm mt-2">✨ Single Next.js app - No separate backend needed!</p>
        </div>

        {!isConfigured ? (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Configure API Key</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-2">
                  This is the API_KEY you set in your environment variables
                </p>
              </div>
              <button
                onClick={handleSaveConfig}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Save Configuration
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/photos" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-2xl font-bold text-white mb-2">Photos</h3>
                <p className="text-gray-300 text-3xl font-bold">{stats.photos}</p>
              </div>
            </Link>

            <Link href="/videos" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-2xl font-bold text-white mb-2">Videos</h3>
                <p className="text-gray-300 text-3xl font-bold">{stats.videos}</p>
              </div>
            </Link>

            <Link href="/messages" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-white mb-2">Messages</h3>
                <p className="text-gray-300 text-3xl font-bold">{stats.messages}</p>
              </div>
            </Link>

            <Link href="/calls" className="group">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-2xl font-bold text-white mb-2">Call Logs</h3>
                <p className="text-gray-300 text-3xl font-bold">{stats.calls}</p>
              </div>
            </Link>
          </div>
        )}

        {isConfigured && (
          <div className="text-center">
            <button
              onClick={() => {
                localStorage.clear();
                setIsConfigured(false);
                setApiKey('');
              }}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Reset Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
