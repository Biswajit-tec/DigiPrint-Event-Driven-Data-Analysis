import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/** Color badges for event types (point #8 from user feedback) */
const eventTypeColors = {
  login: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  click: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  search: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', dot: 'bg-purple-400' },
  api_call: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  page_view: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  session_start: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', dot: 'bg-pink-400' },
  session_end: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
};

const defaultColor = { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', dot: 'bg-gray-400' };

const formatTime = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const formatDeviceInfo = (info) => {
  if (!info) return 'Unknown';
  if (typeof info === 'string') return info;
  const parts = [];
  if (info.browser) parts.push(info.browser);
  if (info.os) parts.push(info.os);
  return parts.join(' / ') || 'Unknown';
};

/**
 * Live Event Feed — scrolling list of event rows with highlight on new arrivals.
 * Props:
 *   events        - array of event objects from v_live_events
 *   highlightIds  - Set of recently-arrived event IDs to flash-highlight
 *   onSelectEvent - callback when clicking a row
 */
const LiveEventFeed = ({ events = [], highlightIds = new Set(), onSelectEvent }) => {
  if (!events.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-xl font-semibold mb-2 text-white">No Events Yet</h3>
        <p className="text-gray-400">
          Waiting for events to appear in the stream...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => {
          const color = eventTypeColors[event.event_type] || defaultColor;
          const isHighlighted = highlightIds.has(event.event_id || event.id);

          return (
            <motion.div
              key={event.event_id || event.id || index}
              className={`glass rounded-lg p-4 border-l-4 cursor-pointer transition-all duration-500 ${
                isHighlighted
                  ? 'border-l-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                  : 'border-l-cyber-500 hover:bg-white/[.06]'
              }`}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{
                opacity: 1,
                x: 0,
                height: 'auto',
                backgroundColor: isHighlighted
                  ? 'rgba(34,197,94,0.08)'
                  : 'rgba(255,255,255,0.05)',
              }}
              exit={{ opacity: 0, x: 30, height: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
              layout
              onClick={() => onSelectEvent?.(event)}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Site + Type + Time */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {event.site_name && (
                      <span className="text-sm font-medium text-white">
                        {event.site_name}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color.bg} ${color.text} ${color.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                      {(event.event_type || '').replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                      {formatTime(event.event_timestamp)}
                    </span>
                  </div>

                  {/* Metadata preview */}
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="text-xs text-gray-500 font-mono truncate max-w-md">
                      {JSON.stringify(event.metadata).slice(0, 80)}
                      {JSON.stringify(event.metadata).length > 80 ? '…' : ''}
                    </div>
                  )}
                </div>

                {/* Right: Session + Device */}
                <div className="text-right text-xs text-gray-500 shrink-0">
                  <div className="font-mono">
                    {event.session_id ? String(event.session_id).slice(0, 8) + '…' : '—'}
                  </div>
                  <div className="mt-1">{formatDeviceInfo(event.device_info)}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LiveEventFeed;
