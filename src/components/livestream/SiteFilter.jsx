import { motion } from 'framer-motion';

const timeRanges = [
  { label: 'All', value: null },
  { label: '5 min', value: 5 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
];

const eventTypes = [
  'all',
  'page_view',
  'click',
  'scroll_depth',
  'form_submit',
  'navigation',
  'search',
  'hover',
  'download',
  'external_link_click',
  'api_call',
  'login',
  'logout',
  'session_start',
  'session_end',
  'rage_click',
];

/**
 * Filter bar for Live Stream: site dropdown, event type, time range.
 */
const SiteFilter = ({
  sites = [],
  selectedSite,
  onSiteChange,
  selectedType,
  onTypeChange,
  selectedRange,
  onRangeChange,
}) => {
  const selectClasses =
    'px-3 py-2 bg-card border border-border rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all appearance-none cursor-pointer';

  return (
    <motion.div
      className="glass rounded-xl p-4 flex flex-wrap items-center gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Site Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Site</label>
        <select
          value={selectedSite || ''}
          onChange={(e) => onSiteChange(e.target.value || null)}
          className={selectClasses}
          style={{ colorScheme: 'dark' }}
        >
          <option value="">All Sites</option>
          {sites.map((s) => (
            <option key={s.id} value={s.domain}>
              {s.site_name}
            </option>
          ))}
        </select>
      </div>

      {/* Event Type Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Type</label>
        <select
          value={selectedType || 'all'}
          onChange={(e) => onTypeChange(e.target.value)}
          className={selectClasses}
          style={{ colorScheme: 'dark' }}
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'all' ? 'All Types' : type.replace(/_/g, ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Range</label>
        <div className="flex gap-1">
          {timeRanges.map((tr) => (
            <button
              key={tr.label}
              onClick={() => onRangeChange(tr.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                selectedRange === tr.value
                  ? 'bg-transparent border-foreground text-foreground shadow-sm'
                  : 'bg-muted border-transparent text-muted-foreground hover:bg-white/10 hover:border-border'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SiteFilter;
