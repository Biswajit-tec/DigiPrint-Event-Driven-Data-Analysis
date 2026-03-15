import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../api/supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Tracking Script Generator — Google Analytics–style install flow.
 * 1. User enters website URL
 * 2. Domain is extracted & registered in Supabase
 * 3. A script snippet is generated for copy-paste
 */
const TrackingScriptGenerator = ({ onSiteRegistered }) => {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setScript('');
    setDomain('');
    setCopied(false);

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // ── Extract domain ──────────────────────────────────────
    let extractedDomain;
    try {
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      extractedDomain = new URL(normalizedUrl).hostname;
      if (!extractedDomain) throw new Error();
    } catch {
      setError('Invalid URL format');
      return;
    }

    setLoading(true);

    try {
      // ── Register site in Supabase ───────────────────────────
      const { error: insertError } = await supabase
        .from('sites')
        .upsert(
          { site_name: extractedDomain, domain: extractedDomain, is_active: true },
          { onConflict: 'domain', ignoreDuplicates: true }
        );

      if (insertError) {
        console.error('Site registration error:', insertError);
        // Continue anyway — site might already exist
      }

      setDomain(extractedDomain);

      // ── Generate snippet ────────────────────────────────────
      const trackerUrl = `${window.location.origin}/tracker.js`;
      const snippet = `<script\n  src="${trackerUrl}"\n  data-domain="${extractedDomain}"\n  data-supabase-url="${SUPABASE_URL}"\n  data-supabase-key="${SUPABASE_ANON_KEY}">\n</script>`;

      setScript(snippet);

      // Notify parent to refresh sites list
      onSiteRegistered?.();
    } catch (err) {
      setError(err.message || 'Failed to register site');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: select text
      const textarea = document.createElement('textarea');
      textarea.value = script;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <motion.div
      className="glass-strong rounded-xl border border-white/10 overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
        <span className="text-lg">🔗</span>
        <div>
          <h3 className="text-lg font-semibold text-white">Track Your Website</h3>
          <p className="text-xs text-gray-400">
            Enter your website URL to generate a tracking script
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="p-5">
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              placeholder="https://your-website.com"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-500/50 focus:ring-1 focus:ring-cyber-500/30 transition-all font-mono text-sm"
            />
            {error && (
              <p className="text-red-400 text-xs mt-1.5">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-cyber-500 text-dark-950 font-medium rounded-lg hover:bg-cyber-400 hover:shadow-glow transition-all duration-200 active:scale-95 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                Registering...
              </span>
            ) : (
              '🚀 Generate Tracking Script'
            )}
          </button>
        </form>
      </div>

      {/* Generated Script Output */}
      <AnimatePresence>
        {script && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              {/* Domain badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">
                  Site registered: <span className="font-mono font-medium">{domain}</span>
                </span>
              </div>

              {/* Script label */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Tracking Script
                </p>
                <span className="text-xs text-gray-500">
                  Paste this in your website's {'<head>'} tag
                </span>
              </div>

              {/* Code block */}
              <div className="relative group">
                <pre className="bg-dark-900/80 border border-white/10 rounded-lg p-4 overflow-x-auto text-sm font-mono text-cyber-300 leading-relaxed">
                  {script}
                </pre>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-gray-300 border border-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Script'}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 glass rounded-lg p-4">
                <p className="text-xs text-gray-400 font-medium mb-2">📌 How it works:</p>
                <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
                  <li>Copy the script above</li>
                  <li>Paste it into your website's <code className="text-cyber-400 bg-white/5 px-1 rounded">&lt;head&gt;</code> tag</li>
                  <li>Deploy your site — events will appear here automatically</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrackingScriptGenerator;
