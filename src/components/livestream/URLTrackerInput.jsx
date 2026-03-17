import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * URL input for tracking a specific website domain.
 * Normalizes URL to domain using new URL().hostname.
 * Props: onTrack(domain) callback
 */
const URLTrackerInput = ({ onTrack, currentDomain }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      // Normalize: add protocol if missing
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      const domain = new URL(normalizedUrl).hostname;

      if (!domain) {
        setError('Invalid URL');
        return;
      }

      onTrack(domain);
      setUrl('');
    } catch {
      setError('Invalid URL format');
    }
  };

  const handleClear = () => {
    onTrack(null);
    setUrl('');
    setError('');
  };

  return (
    <motion.div
      className="glass-strong rounded-xl p-5 border border-border"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-lg">🔍</span>
        <h3 className="text-lg font-semibold text-foreground">Track Website URL</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(''); }}
            placeholder="https://example.com"
            className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono text-sm"
          />
          {error && <p className="text-red-400 text-xs mt-1 absolute">{error}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 hover:shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 text-sm whitespace-nowrap"
          >
            Start Monitoring
          </button>
          {currentDomain && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 glass text-muted-foreground rounded-lg hover:bg-white/10 transition-all text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {currentDomain && (
        <motion.div
          className="mt-3 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">
            Monitoring: <span className="font-mono font-medium">{currentDomain}</span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default URLTrackerInput;
