import { motion, AnimatePresence } from 'framer-motion';

/** Color badges for event types */
const eventTypeColors = {
  login: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  logout: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-400' },
  click: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  search: { bg: 'bg-secondary/20', text: 'text-secondary-foreground', border: 'border-secondary/30', dot: 'bg-secondary/90' },
  api_call: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  page_view: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  session_start: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', dot: 'bg-pink-400' },
  session_end: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
  scroll: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
  scroll_depth: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
  form_submit: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  navigation: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30', dot: 'bg-sky-400' },
  hover: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  download: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30', dot: 'bg-teal-400' },
  external_link_click: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  rage_click: { bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600/30', dot: 'bg-red-500' },
};

const defaultColor = { bg: 'bg-gray-500/20', text: 'text-muted-foreground', border: 'border-gray-500/30', dot: 'bg-gray-400' };

/** Event type icons (SVG paths) */
const eventIcons = {
  click: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
  page_view: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  scroll: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  scroll_depth: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  form_submit: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  navigation: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  external_link_click: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  hover: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    </svg>
  ),
  login: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  session_start: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  session_end: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
    </svg>
  ),
  rage_click: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

const defaultIcon = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

/** Generate a human-readable description from event type + metadata */
const getEventDescription = (event) => {
  const meta = event.metadata || {};
  const page = meta.page || meta.url || '';
  const pageName = page ? page.replace(/^\//, '') || 'homepage' : 'the page';

  switch (event.event_type) {
    case 'page_view':
      return `User opened the ${pageName}`;
    case 'click':
      if (meta.text) return `User clicked "${meta.text}" on ${pageName}`;
      if (meta.element) return `User clicked a ${meta.element.toLowerCase()} on ${pageName}`;
      return `User clicked an element on ${pageName}`;
    case 'scroll':
    case 'scroll_depth':
      if (meta.scroll_percent) return `User scrolled ${meta.scroll_percent}% of ${pageName}`;
      if (meta.depth) return `User scrolled ${meta.depth}% of ${pageName}`;
      return `User scrolled the page`;
    case 'form_submit':
      if (meta.formId) return `User submitted form "${meta.formId}" on ${pageName}`;
      return `User submitted a form on ${pageName}`;
    case 'navigation':
      if (meta.from && meta.to) return `User navigated from ${meta.from} to ${meta.to}`;
      return `User navigated to ${pageName}`;
    case 'session_start':
      return `Session started on ${pageName}`;
    case 'session_end':
      return `Session ended`;
    case 'login':
      return `User logged in`;
    case 'logout':
      return `User logged out`;
    case 'search':
      if (meta.query) return `User searched for "${meta.query}"`;
      return `User performed a search on ${pageName}`;
    case 'hover':
      if (meta.element) return `User hovered over ${meta.element.toLowerCase()} for ${meta.duration || '1'}s`;
      return `User hovered on an element`;
    case 'download':
      if (meta.file) return `User downloaded "${meta.file}"`;
      return `User downloaded a file`;
    case 'external_link_click':
      if (meta.url) return `User clicked external link to ${meta.url}`;
      return `User clicked an external link`;
    case 'api_call':
      if (meta.endpoint) return `API ${meta.method || 'GET'} call to ${meta.endpoint}`;
      return `API call made`;
    case 'rage_click':
      if (meta.text) return `Rage click on "${meta.text}" (${meta.clicks || 3}x)`;
      if (meta.element) return `Rage click on ${meta.element.toLowerCase()} (${meta.clicks || 3}x)`;
      return `Rage click detected`;
    default:
      return `${(event.event_type || 'unknown').replace(/_/g, ' ')} event occurred`;
  }
};

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
 * Live Event Feed — scrolling list of event rows with human-readable descriptions.
 */
const LiveEventFeed = ({ events = [], highlightIds = new Set(), onSelectEvent }) => {
  if (!events.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No Events Yet</h3>
        <p className="text-muted-foreground">
          Waiting for events to appear in the stream...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => {
          const color = eventTypeColors[event.event_type] || defaultColor;
          const icon = eventIcons[event.event_type] || defaultIcon;
          const isHighlighted = highlightIds.has(event.event_id || event.id);
          const description = getEventDescription(event);

          return (
            <motion.div
              key={event.event_id || event.id || index}
              className={`glass rounded-lg p-4 border-l-4 cursor-pointer transition-all duration-500 ${
                isHighlighted
                  ? 'border-l-green-400 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
                  : 'border-l-primary hover:bg-white/[.06]'
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
                {/* Left: Icon + Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {/* Event icon */}
                    <span className={`${color.text} shrink-0`}>{icon}</span>

                    {event.site_name && (
                      <span className="text-sm font-medium text-foreground">
                        {event.site_name}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color.bg} ${color.text} ${color.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                      {(event.event_type || '').replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="text-muted-foreground text-xs font-mono">
                      {formatTime(event.event_timestamp)}
                    </span>
                  </div>

                  {/* Human-readable description */}
                  <p className="text-sm text-muted-foreground ml-6">
                    {description}
                  </p>
                </div>

                {/* Right: Session + Device */}
                <div className="text-right text-xs text-muted-foreground shrink-0">
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
