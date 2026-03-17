import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../api/supabaseClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Unified Tracking Script Generator — 3-step flow:
 * Step 1: Enter URL → Generate Script
 * Step 2: View script + Copy → Start Monitoring
 * Step 3: Monitoring active (banner collapses)
 */
const TrackingScriptGenerator = ({ onSiteRegistered, onStartMonitoring }) => {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Step logic
  const step = isMonitoring ? 3 : script ? 2 : 1;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setScript('');
    setDomain('');
    setCopied(false);
    setIsMonitoring(false);

    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    // Extract domain
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
      // Get the current user's ID for RLS compliance
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;

      // Register site in Supabase with user_id (required by RLS policy)
      const { error: insertError } = await supabase
        .from('sites')
        .upsert(
          {
            site_name: extractedDomain,
            domain: extractedDomain,
            is_active: true,
            user_id: userId,
          },
          { onConflict: 'domain', ignoreDuplicates: true }
        );

      if (insertError) {
        console.error('Site registration error:', insertError);
        // Continue anyway — site might already exist
      }

      setDomain(extractedDomain);

      // Generate snippet
      const trackerUrl = `${window.location.origin}/tracker.js`;
      const snippet = `<script\n  src="${trackerUrl}"\n  data-domain="${extractedDomain}"\n  data-supabase-url="${SUPABASE_URL}"\n  data-supabase-key="${SUPABASE_ANON_KEY}">\n</script>`;

      setScript(snippet);
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

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    onStartMonitoring?.(domain);
  };

  const handleReset = () => {
    setUrl('');
    setDomain('');
    setScript('');
    setError('');
    setCopied(false);
    setIsMonitoring(false);
    onStartMonitoring?.(null);
  };

  return (
    <motion.div
      className="glass-strong rounded-xl border border-border overflow-hidden"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">{step === 3 ? '📡' : '🔗'}</span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {step === 3 ? 'Live Monitoring' : 'Track Your Website'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {step === 1 && 'Enter your website URL to generate a tracking script'}
              {step === 2 && 'Copy the script and install it on your website'}
              {step === 3 && `Monitoring live events from ${domain}`}
            </p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="hidden sm:flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === step
                  ? 'bg-primary text-primary-foreground'
                  : s < step
                    ? 'bg-primary/30 text-primary'
                    : 'bg-white/10 text-muted-foreground'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Monitoring active — compact */}
      {step === 3 && (
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">
              Monitoring: <span className="font-mono font-medium">{domain}</span>
            </span>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 glass text-muted-foreground rounded-lg hover:bg-white/10 transition-all text-sm active:scale-95"
          >
            Change Website
          </button>
        </div>
      )}

      {/* Step 1: URL Input */}
      {step < 3 && (
        <div className="p-5">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                placeholder="https://your-website.com"
                disabled={step === 2}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm disabled:opacity-50"
              />
              {error && (
                <p className="text-red-400 text-xs mt-1.5">{error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || step === 2}
                className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 border border-border transition-all duration-200 active:scale-95 text-sm whitespace-nowrap disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:opacity-100 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </span>
                ) : (
                  ' Generate Script'
                )}
              </button>
              <button
                type="button"
                onClick={handleStartMonitoring}
                disabled={step !== 2}
                className={`px-5 py-2.5 font-medium rounded-lg border border-border transition-all duration-200 active:scale-95 text-sm whitespace-nowrap ${
                  step === 2
                    ? 'bg-green-500 text-foreground hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                Start Monitoring
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Generated Script Output */}
      <AnimatePresence>
        {step === 2 && script && (
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
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Tracking Script
                </p>
                <span className="text-xs text-muted-foreground">
                  Paste this in your website's {'<head>'} tag
                </span>
              </div>

              {/* Code block */}
              <div className="relative group">
                <pre className="bg-card/80 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono text-primary/80 leading-relaxed">
                  {script}
                </pre>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className={`absolute top-3 right-3 px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-white/10 text-muted-foreground border border-border hover:bg-white/20 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Script'}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 glass rounded-lg p-4">
                <p className="text-xs text-muted-foreground font-medium mb-2">📌 How it works:</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Copy the script above</li>
                  <li>Paste it into your website's <code className="text-primary bg-muted px-1 rounded">&lt;head&gt;</code> tag</li>
                  <li>Click <strong className="text-green-400">Start Monitoring</strong> to begin tracking events</li>
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
