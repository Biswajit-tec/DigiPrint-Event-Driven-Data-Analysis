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
  'search',
  'api_call',
  'login',
  'session_start',
  'session_end',
];

/**
 * Filter bar for Live Stream: site dropdown, event type, time range.
 * Props:
 *   sites           - array of { id, site_name, domain }
 *   selectedSite    - current domain string or null
 *   onSiteChange    - callback(domain)
 *   selectedType    - current event type
 *   onTypeChange    - callback(type)
 *   selectedRange   - minutes number or null
 *   onRangeChange   - callback(minutes)
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
    'px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-cyber-500/50 focus:ring-1 focus:ring-cyber-500/30 transition-all appearance-none cursor-pointer';

  return (
    <motion.div
      className="glass rounded-xl p-4 flex flex-wrap items-center gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Site Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">Site</label>
        <select
          value={selectedSite || ''}
          onChange={(e) => onSiteChange(e.target.value || null)}
          className={selectClasses}
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
        <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">Type</label>
        <select
          value={selectedType || 'all'}
          onChange={(e) => onTypeChange(e.target.value)}
          className={selectClasses}
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
        <label className="text-xs text-gray-400 uppercase tracking-wide font-medium">Range</label>
        <div className="flex gap-1">
          {timeRanges.map((tr) => (
            <button
              key={tr.label}
              onClick={() => onRangeChange(tr.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedRange === tr.value
                  ? 'bg-cyber-500/20 text-cyber-400 border border-cyber-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
