import { motion, AnimatePresence } from 'framer-motion';

/**
 * Side panel modal for event metadata.
 * Props:
 *   event   - selected event object (null to hide)
 *   onClose - callback
 */
const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  const formatDeviceInfo = (info) => {
    if (!info) return 'Unknown';
    if (typeof info === 'string') return info;
    return JSON.stringify(info, null, 2);
  };

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 glass-strong border-l border-border overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Event Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Detail Rows */}
              <div className="space-y-4">
                <DetailRow label="Site" value={event.site_name || '—'} />
                <DetailRow label="Domain" value={event.domain || '—'} />
                <DetailRow
                  label="Event Type"
                  value={
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                      {(event.event_type || '').replace(/_/g, ' ').toUpperCase()}
                    </span>
                  }
                />
                <DetailRow
                  label="Timestamp"
                  value={
                    event.event_timestamp
                      ? new Date(event.event_timestamp).toLocaleString()
                      : '—'
                  }
                />
                <DetailRow
                  label="Session ID"
                  value={
                    <span className="font-mono text-sm break-all">
                      {event.session_id || '—'}
                    </span>
                  }
                />
                <DetailRow
                  label="Device Info"
                  value={
                    <pre className="font-mono text-xs bg-card/60 p-3 rounded-lg overflow-auto max-h-32 text-muted-foreground">
                      {formatDeviceInfo(event.device_info)}
                    </pre>
                  }
                />
              </div>

              {/* Metadata */}
              <div className="mt-6">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wide font-medium mb-3">
                  Metadata
                </h3>
                <pre className="font-mono text-xs bg-card/60 p-4 rounded-lg overflow-auto max-h-80 text-primary/80 border border-white/5">
                  {event.metadata
                    ? JSON.stringify(event.metadata, null, 2)
                    : 'No metadata'}
                </pre>
              </div>

              {/* Event ID */}
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Event ID: <span className="font-mono">{event.event_id || event.id || '—'}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">{label}</p>
    <div className="text-foreground text-sm">{value}</div>
  </div>
);

export default EventDetailsModal;
