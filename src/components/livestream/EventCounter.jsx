import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Live Event Counter badge.
 * Shows events-per-second with animated counter.
 * Props: rate (number from v_event_rate), eventCount (total events in feed)
 */
const EventCounter = ({ rate = 0, eventCount = 0 }) => {
  const [displayRate, setDisplayRate] = useState(0);
  const springRate = useSpring(0, { stiffness: 80, damping: 15 });

  useEffect(() => {
    springRate.set(typeof rate === 'number' ? rate : parseFloat(rate) || 0);
    const unsub = springRate.on('change', (v) =>
      setDisplayRate(Math.round(v * 100) / 100)
    );
    return unsub;
  }, [rate, springRate]);

  return (
    <motion.div
      className="glass-strong rounded-xl p-4 flex items-center gap-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-6">
        {/* Events per second */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Events/sec</p>
            <p className="text-2xl font-bold text-cyber-400 tabular-nums">
              {displayRate}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/10" />

        {/* Feed count */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">In Feed</p>
            <p className="text-lg font-semibold text-white tabular-nums">{eventCount}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCounter;
