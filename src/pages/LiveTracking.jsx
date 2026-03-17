import { motion } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import { pageVariants } from '../utils/animations';
import GlassCard from '../components/ui/GlassCard';
import SiteFilter from '../components/livestream/SiteFilter';
import LiveEventFeed from '../components/livestream/LiveEventFeed';
import EventDetailsModal from '../components/livestream/EventDetailsModal';
import EventCounter from '../components/livestream/EventCounter';
import TrackingScriptGenerator from '../components/livestream/TrackingScriptGenerator';
import {
  fetchLiveEvents,
  fetchSitesList,
  fetchEventRate,
  subscribeLiveEvents,
  unsubscribeChannel,
} from '../api/queries';

const LiveTracking = () => {
  // Filter state
  const [trackedDomain, setTrackedDomain] = useState(null);
  const [siteFilter, setSiteFilter] = useState(null);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [timeRange, setTimeRange] = useState(null);

  // Data state
  const [events, setEvents] = useState([]);
  const [sites, setSites] = useState([]);
  const [eventRate, setEventRate] = useState(0);
  const [highlightIds, setHighlightIds] = useState(new Set());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const channelRef = useRef(null);
  const highlightTimerRef = useRef({});

  // Effective domain: URL tracker overrides site filter
  const activeDomain = trackedDomain || siteFilter;

  // ─── Load initial data ─────────────────────────────────────
  const loadEvents = useCallback(async () => {
    try {
      const data = await fetchLiveEvents({
        limit: 100,
        domain: activeDomain,
        eventType: eventTypeFilter,
        minutes: timeRange,
      });
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeDomain, eventTypeFilter, timeRange]);

  // Load sites list
  const refreshSites = () => {
    fetchSitesList().then(setSites).catch(console.error);
  };
  useEffect(() => {
    refreshSites();
  }, []);

  // Load events when filters change
  useEffect(() => {
    setLoading(true);
    loadEvents();
  }, [loadEvents]);

  // Refresh event rate periodically
  useEffect(() => {
    const loadRate = async () => {
      try {
        const data = await fetchEventRate();
        setEventRate(data?.events_per_second ?? 0);
      } catch {
        // non-critical
      }
    };
    loadRate();
    const interval = setInterval(loadRate, 10_000);
    return () => clearInterval(interval);
  }, []);

  // ─── Realtime subscription ────────────────────────────────
  useEffect(() => {
    if (isPaused) return;

    const channel = subscribeLiveEvents((newEvent) => {
      const eventId = newEvent.id || newEvent.event_id || Date.now();

      // Prepend and trim to 100
      setEvents((prev) => {
        const enriched = {
          event_id: eventId,
          event_type: newEvent.event_type,
          event_timestamp: newEvent.event_timestamp,
          metadata: newEvent.metadata,
          session_id: newEvent.session_id,
          site_name: newEvent.site_name || '',
          domain: newEvent.domain || '',
          device_info: newEvent.device_info || null,
        };
        return [enriched, ...prev].slice(0, 100);
      });

      // Highlight new event
      setHighlightIds((prev) => new Set([...prev, eventId]));
      highlightTimerRef.current[eventId] = setTimeout(() => {
        setHighlightIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });
        delete highlightTimerRef.current[eventId];
      }, 2000);
    });

    channelRef.current = channel;

    return () => {
      unsubscribeChannel(channel);
      Object.values(highlightTimerRef.current).forEach(clearTimeout);
      highlightTimerRef.current = {};
    };
  }, [isPaused, activeDomain]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleStartMonitoring = (domain) => {
    setTrackedDomain(domain);
    if (domain) {
      setSiteFilter(null);
    }
  };

  const handleSiteFilterChange = (domain) => {
    setSiteFilter(domain);
    if (domain) {
      setTrackedDomain(null);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen py-8"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Live Event Tracking</h1>
          <p className="text-muted-foreground">Real-time event monitoring across tracked websites</p>
        </div>

        {/* Unified Tracking Script Generator + Monitoring */}
        <div className="mb-4">
          <TrackingScriptGenerator
            onSiteRegistered={refreshSites}
            onStartMonitoring={handleStartMonitoring}
          />
        </div>

        {/* Controls Row: Filters + Counter */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-4 mb-4">
          <SiteFilter
            sites={sites}
            selectedSite={siteFilter}
            onSiteChange={handleSiteFilterChange}
            selectedType={eventTypeFilter}
            onTypeChange={setEventTypeFilter}
            selectedRange={timeRange}
            onRangeChange={setTimeRange}
          />
          <EventCounter rate={eventRate} eventCount={events.length} />
        </div>

        {/* Stream Controls */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              isPaused
                ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30'
            }`}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={() => { setLoading(true); loadEvents(); }}
            className="px-4 py-2 glass rounded-lg text-sm text-muted-foreground hover:bg-white/10 transition-all active:scale-95"
          >
            🔄 Refresh
          </button>

          {error && (
            <span className="text-xs text-red-400 ml-auto">⚠️ {error}</span>
          )}

          {!isPaused && (
            <span className="flex items-center gap-2 text-xs text-green-400 ml-auto">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live — Realtime connected
            </span>
          )}
        </div>

        {/* Event Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : (
          <GlassCard>
            <LiveEventFeed
              events={events}
              highlightIds={highlightIds}
              onSelectEvent={setSelectedEvent}
            />
          </GlassCard>
        )}
      </div>

      {/* Event Details Side Panel */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </motion.div>
  );
};

export default LiveTracking;
