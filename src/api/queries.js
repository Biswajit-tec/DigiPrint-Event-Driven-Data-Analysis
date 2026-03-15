import { supabase } from './supabaseClient';

// ─── Dashboard Queries ──────────────────────────────────────────

/** Fetch dashboard-level summary metrics via RPC */
export async function fetchDashboardSummary() {
  const { data, error } = await supabase.rpc('get_dashboard_summary');
  if (error) throw error;
  return data?.[0] ?? null;
}

/** Fetch events-per-second from v_event_rate view */
export async function fetchEventRate() {
  const { data, error } = await supabase
    .from('v_event_rate')
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/** Fetch per-site analytics from v_site_analytics view */
export async function fetchSiteAnalytics() {
  const { data, error } = await supabase
    .from('v_site_analytics')
    .select('*');
  if (error) throw error;
  return data ?? [];
}

/** Fetch top event types with counts */
export async function fetchTopEventTypes() {
  const { data, error } = await supabase
    .from('events')
    .select('event_type')
    .limit(5000); // fetch batch, aggregate client-side
  if (error) throw error;

  // Aggregate counts
  const counts = {};
  (data ?? []).forEach((row) => {
    counts[row.event_type] = (counts[row.event_type] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([event_type, count]) => ({ event_type, count }))
    .sort((a, b) => b.count - a.count);
}

// ─── Live Events Queries ────────────────────────────────────────

/**
 * Fetch live events from v_live_events view.
 * @param {Object} options
 * @param {number}  options.limit       - Max rows (default 50)
 * @param {string}  [options.domain]    - Filter by domain
 * @param {string}  [options.eventType] - Filter by event_type
 * @param {number}  [options.minutes]   - Time range in minutes
 */
export async function fetchLiveEvents({
  limit = 50,
  domain = null,
  eventType = null,
  minutes = null,
} = {}) {
  let query = supabase
    .from('v_live_events')
    .select('*')
    .order('event_timestamp', { ascending: false })
    .limit(limit);

  if (domain) {
    query = query.eq('domain', domain);
  }
  if (eventType && eventType !== 'all') {
    query = query.eq('event_type', eventType);
  }
  if (minutes) {
    const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
    query = query.gte('event_timestamp', since);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Fetch list of active sites for filter dropdown */
export async function fetchSitesList() {
  const { data, error } = await supabase
    .from('sites')
    .select('id, site_name, domain')
    .eq('is_active', true)
    .order('site_name');
  if (error) throw error;
  return data ?? [];
}

// ─── Realtime Subscription ──────────────────────────────────────

/**
 * Subscribe to live INSERT events on the events table.
 * Returns subscription channel for cleanup.
 */
export function subscribeLiveEvents(onNewEvent) {
  const channel = supabase
    .channel('events-stream')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
      },
      (payload) => {
        onNewEvent(payload.new);
      }
    )
    .subscribe();

  return channel;
}

/** Unsubscribe from a channel */
export function unsubscribeChannel(channel) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
