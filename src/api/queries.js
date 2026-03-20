import { supabase } from './supabaseClient';

const LIVE_EVENT_SELECT = `
  id,
  site_id,
  session_id,
  event_type,
  event_timestamp,
  metadata,
  sessions (
    device_info
  ),
  sites (
    site_name,
    domain
  )
`;

const SUPPORTED_RANGE_KEYS = new Set(['1h', '24h', '7d', '30d']);

function normalizeRelation(value) {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

function normalizeLiveEvent(row) {
  const session = normalizeRelation(row.sessions);
  const site = normalizeRelation(row.sites);

  return {
    id: row.id,
    event_id: row.id,
    site_id: row.site_id,
    session_id: row.session_id,
    event_type: row.event_type,
    event_timestamp: row.event_timestamp,
    metadata: row.metadata || {},
    device_info: session?.device_info || null,
    site_name: site?.site_name || '',
    domain: site?.domain || '',
  };
}

function getRangeStart(range) {
  if (!range) return null;
  if (typeof range === 'number' && Number.isFinite(range)) {
    return new Date(Date.now() - range * 60 * 1000).toISOString();
  }
  if (typeof range === 'object' && range.from) {
    return new Date(range.from).toISOString();
  }
  if (typeof range !== 'string' || !SUPPORTED_RANGE_KEYS.has(range)) {
    return null;
  }

  const now = Date.now();
  const map = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now - map[range]).toISOString();
}

function applyTimeFilter(query, column, options = {}) {
  const since = options.since || getRangeStart(options.range) || null;
  if (since) {
    return query.gt(column, since);
  }
  return query;
}

function applySiteFilter(query, siteIds) {
  if (Array.isArray(siteIds) && siteIds.length > 0) {
    return query.in('site_id', siteIds);
  }
  return query;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function toHumanRangeLabel(range) {
  if (range === '1h') return 'Last 1h';
  if (range === '7d') return 'Last 7d';
  if (range === '30d') return 'Last 30d';
  return 'Last 24h';
}

function getTimeBucket(dateString, range) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const minute = date.getMinutes();

  if (range === '1h') {
    const bucketMin = String(Math.floor(minute / 5) * 5).padStart(2, '0');
    return {
      key: `${y}-${m}-${d} ${h}:${bucketMin}`,
      label: `${h}:${bucketMin}`,
    };
  }
  if (range === '24h') {
    return {
      key: `${y}-${m}-${d} ${h}:00`,
      label: `${h}:00`,
    };
  }
  return {
    key: `${y}-${m}-${d}`,
    label: `${m}/${d}`,
  };
}

function buildCsv(rows) {
  if (!rows?.length) return '';
  const headers = Object.keys(rows[0]);
  const escapedHeader = headers.join(',');
  const escapedRows = rows.map((row) =>
    headers
      .map((key) => {
        const raw = row[key] ?? '';
        const value = String(raw).replace(/"/g, '""');
        return `"${value}"`;
      })
      .join(',')
  );
  return [escapedHeader, ...escapedRows].join('\n');
}

// ---------------------------------------------------------------------------
// Dashboard Queries
// ---------------------------------------------------------------------------

export async function fetchDashboardSummary() {
  try {
    const [sitesRes, sessionsRes, eventsRes, activeRes] = await Promise.all([
      supabase.from('sites').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('sessions').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('sessions').select('id', { count: 'exact', head: true }).is('end_time', null),
    ]);

    let mostActiveHour = null;
    try {
      const { data: hourData } = await supabase
        .from('events')
        .select('event_timestamp')
        .order('event_timestamp', { ascending: false })
        .limit(2000);

      if (hourData?.length) {
        const hourCounts = {};
        hourData.forEach((row) => {
          const hour = new Date(row.event_timestamp).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const topHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
        mostActiveHour = topHour != null ? Number(topHour) : null;
      }
    } catch {
      // Non-critical fallback.
    }

    const totalEvents = eventsRes.count || 0;
    const totalSessions = sessionsRes.count || 0;
    const avgEventsPerSession = totalSessions > 0
      ? Math.round((totalEvents / totalSessions) * 100) / 100
      : 0;

    return {
      total_sites: sitesRes.count || 0,
      total_users: 0,
      total_sessions: totalSessions,
      total_events: totalEvents,
      active_sessions: activeRes.count || 0,
      most_active_hour: mostActiveHour,
      avg_events_per_session: avgEventsPerSession,
    };
  } catch (err) {
    console.error('fetchDashboardSummary error:', err);
    return {
      total_sites: 0,
      total_users: 0,
      total_sessions: 0,
      total_events: 0,
      active_sessions: 0,
      most_active_hour: null,
      avg_events_per_session: 0,
    };
  }
}

export async function fetchEventRate() {
  try {
    const tenSecondsAgo = new Date(Date.now() - 10_000).toISOString();
    const { count, error } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .gt('event_timestamp', tenSecondsAgo);

    if (error) throw error;
    return { events_per_second: Math.round(((count || 0) / 10) * 100) / 100 };
  } catch {
    return { events_per_second: 0 };
  }
}

export async function fetchSiteAnalytics() {
  try {
    const { data, error } = await supabase.from('v_site_analytics').select('*');
    if (!error && data) return data;
  } catch {
    // Fallback below.
  }

  try {
    const { data: sites } = await supabase
      .from('sites')
      .select('id, site_name, domain')
      .eq('is_active', true);
    if (!sites?.length) return [];

    const rows = await Promise.all(
      sites.map(async (site) => {
        const [eventsRes, sessionsRes] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }).eq('site_id', site.id),
          supabase.from('sessions').select('id', { count: 'exact', head: true }).eq('site_id', site.id),
        ]);
        return {
          site_name: site.site_name,
          domain: site.domain,
          total_events: eventsRes.count || 0,
          total_sessions: sessionsRes.count || 0,
        };
      })
    );
    return rows.sort((a, b) => b.total_events - a.total_events);
  } catch {
    return [];
  }
}

export async function fetchTopEventTypes() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('event_type')
      .limit(6000);
    if (error) throw error;

    const counts = {};
    (data || []).forEach((row) => {
      const type = row.event_type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Existing analytics pages (legacy compatibility)
// ---------------------------------------------------------------------------

export async function fetchEventFrequency() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('event_timestamp')
      .order('event_timestamp', { ascending: false })
      .limit(5000);
    if (error) throw error;

    const sortedData = (data || []).sort(
      (a, b) => new Date(a.event_timestamp) - new Date(b.event_timestamp)
    );

    const dateCounts = {};
    sortedData.forEach((row) => {
      const date = new Date(row.event_timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    return Object.entries(dateCounts).map(([date, events]) => ({
      date,
      events,
      sessions: Math.max(1, Math.floor(events / 5)),
    }));
  } catch {
    return [];
  }
}

export async function fetchPeakActivity() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('event_timestamp')
      .order('event_timestamp', { ascending: false })
      .limit(6000);
    if (error) throw error;

    const hourCounts = {};
    (data || []).forEach((row) => {
      const hour = new Date(row.event_timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .map(([hour, event_count]) => ({ hour: Number(hour), event_count }))
      .sort((a, b) => a.hour - b.hour);
  } catch {
    return [];
  }
}

export async function fetchSiteBehavior() {
  try {
    const { data: sites } = await supabase
      .from('sites')
      .select('id, site_name, domain')
      .eq('is_active', true);
    if (!sites?.length) return [];

    const rows = await Promise.all(
      sites.slice(0, 10).map(async (site) => {
        const [eventsRes, sessionsRes] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }).eq('site_id', site.id),
          supabase.from('sessions').select('id', { count: 'exact', head: true }).eq('site_id', site.id),
        ]);
        return {
          username: site.site_name || site.domain,
          total_events: eventsRes.count || 0,
          total_sessions: sessionsRes.count || 1,
        };
      })
    );
    return rows.sort((a, b) => b.total_events - a.total_events);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Live events + realtime + polling
// ---------------------------------------------------------------------------

export async function fetchUserSites() {
  try {
    const { data, error } = await supabase
      .from('sites')
      .select('id, site_name, domain, is_active, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchUserSites error:', err);
    return [];
  }
}

export async function fetchSitesList() {
  return fetchUserSites();
}

export async function fetchLiveEvents({
  limit = 50,
  siteId = null,
  siteIds = null,
  domain = null,
  eventType = null,
  minutes = null,
  since = null,
  search = null,
} = {}) {
  try {
    const effectiveSiteIds = siteIds?.length
      ? siteIds
      : siteId != null
        ? [siteId]
        : null;

    let query = supabase
      .from('events')
      .select(LIVE_EVENT_SELECT)
      .order('event_timestamp', { ascending: false })
      .limit(clamp(limit, 1, 500));

    query = applySiteFilter(query, effectiveSiteIds);

    if (eventType && eventType !== 'all') {
      query = query.eq('event_type', eventType);
    }

    const sinceFromMinutes = typeof minutes === 'number' && minutes > 0
      ? new Date(Date.now() - minutes * 60 * 1000).toISOString()
      : null;
    const effectiveSince = since || sinceFromMinutes;
    if (effectiveSince) {
      query = query.gt('event_timestamp', effectiveSince);
    }

    const { data, error } = await query;
    if (error) throw error;

    let rows = (data || []).map(normalizeLiveEvent);
    if (domain) {
      rows = rows.filter((row) => row.domain === domain);
    }
    if (search?.trim()) {
      const needle = search.trim().toLowerCase();
      rows = rows.filter((row) => {
        const payload = JSON.stringify(row.metadata || {}).toLowerCase();
        return (
          String(row.event_type || '').toLowerCase().includes(needle) ||
          String(row.site_name || '').toLowerCase().includes(needle) ||
          String(row.domain || '').toLowerCase().includes(needle) ||
          payload.includes(needle)
        );
      });
    }

    return rows.slice(0, limit);
  } catch (err) {
    console.error('fetchLiveEvents error:', err);
    return [];
  }
}

export async function fetchNewEvents(siteIds, since, options = {}) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const limit = clamp(options.limit || 150, 1, 500);
    let query = supabase
      .from('events')
      .select(LIVE_EVENT_SELECT)
      .in('site_id', siteIds)
      .order('event_timestamp', { ascending: true })
      .limit(limit);

    if (since) {
      query = query.gt('event_timestamp', since);
    }
    if (options.eventType && options.eventType !== 'all') {
      query = query.eq('event_type', options.eventType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(normalizeLiveEvent);
  } catch (err) {
    console.error('fetchNewEvents error:', err);
    return [];
  }
}

export function subscribeLiveEvents({
  siteIds,
  onNewEvent,
  onStatusChange,
}) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) {
    onStatusChange?.('NO_SITES');
    return null;
  }

  const filterValue = `site_id=in.(${siteIds.join(',')})`;
  const channelName = `events-stream-${siteIds.join('-')}-${Date.now()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
        filter: filterValue,
      },
      async (payload) => {
        const inserted = payload?.new;
        if (!inserted) return;

        try {
          const { data, error } = await supabase
            .from('events')
            .select(LIVE_EVENT_SELECT)
            .eq('id', inserted.id)
            .single();

          if (error) throw error;
          onNewEvent?.(normalizeLiveEvent(data));
        } catch {
          onNewEvent?.({
            id: inserted.id,
            event_id: inserted.id,
            site_id: inserted.site_id,
            session_id: inserted.session_id,
            event_type: inserted.event_type,
            event_timestamp: inserted.event_timestamp,
            metadata: inserted.metadata || {},
            device_info: null,
            site_name: '',
            domain: '',
          });
        }
      }
    )
    .subscribe((status) => {
      onStatusChange?.(status);
    });

  return channel;
}

export function unsubscribeChannel(channel) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}

// ---------------------------------------------------------------------------
// Production analytics (aggregated helper set)
// ---------------------------------------------------------------------------

export async function fetchOverviewMetrics(siteIds, range = '24h') {
  if (!Array.isArray(siteIds) || siteIds.length === 0) {
    return {
      total_events: 0,
      sessions: 0,
      active_users: 0,
      avg_session_duration: 0,
      range_label: toHumanRangeLabel(range),
    };
  }

  try {
    let eventsCountQuery = supabase
      .from('events')
      .select('id', { count: 'exact', head: true });
    eventsCountQuery = applySiteFilter(eventsCountQuery, siteIds);
    eventsCountQuery = applyTimeFilter(eventsCountQuery, 'event_timestamp', { range });

    let sessionsCountQuery = supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true });
    sessionsCountQuery = sessionsCountQuery.in('site_id', siteIds);
    sessionsCountQuery = applyTimeFilter(sessionsCountQuery, 'start_time', { range });

    let sessionsDurationQuery = supabase
      .from('sessions')
      .select('duration_seconds, start_time, end_time')
      .in('site_id', siteIds)
      .limit(4000);
    sessionsDurationQuery = applyTimeFilter(sessionsDurationQuery, 'start_time', { range });

    let activeUsersQuery = supabase
      .from('events')
      .select('session_id')
      .in('site_id', siteIds)
      .limit(8000);
    activeUsersQuery = applyTimeFilter(activeUsersQuery, 'event_timestamp', { range });

    const [eventsCountRes, sessionsCountRes, durationRes, activeUsersRes] = await Promise.all([
      eventsCountQuery,
      sessionsCountQuery,
      sessionsDurationQuery,
      activeUsersQuery,
    ]);

    const durations = (durationRes.data || [])
      .map((row) => {
        if (typeof row.duration_seconds === 'number') return row.duration_seconds;
        if (row.start_time && row.end_time) {
          const ms = new Date(row.end_time).getTime() - new Date(row.start_time).getTime();
          return ms > 0 ? Math.round(ms / 1000) : 0;
        }
        return 0;
      })
      .filter((value) => Number.isFinite(value) && value >= 0);

    const avgSessionDuration = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const activeUsers = new Set((activeUsersRes.data || []).map((row) => row.session_id).filter(Boolean)).size;

    return {
      total_events: eventsCountRes.count || 0,
      sessions: sessionsCountRes.count || 0,
      active_users: activeUsers,
      avg_session_duration: avgSessionDuration,
      range_label: toHumanRangeLabel(range),
    };
  } catch (err) {
    console.error('fetchOverviewMetrics error:', err);
    return {
      total_events: 0,
      sessions: 0,
      active_users: 0,
      avg_session_duration: 0,
      range_label: toHumanRangeLabel(range),
    };
  }
}

export async function fetchEventDistribution(siteIds, range = '24h') {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    let query = supabase
      .from('events')
      .select('event_type, event_timestamp')
      .in('site_id', siteIds)
      .limit(10000);
    query = applyTimeFilter(query, 'event_timestamp', { range });
    const { data, error } = await query;
    if (error) throw error;

    const counts = {};
    (data || []).forEach((row) => {
      const type = row.event_type || 'unknown';
      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count);
  } catch (err) {
    console.error('fetchEventDistribution error:', err);
    return [];
  }
}

export async function fetchEventsOverTime(siteIds, range = '24h') {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    let query = supabase
      .from('v_events_over_time')
      .select('*');
    query = applySiteFilter(query, siteIds);
    query = applyTimeFilter(query, 'time_bucket', { range });
    const { data, error } = await query.order('time_bucket', { ascending: true });
    if (!error && data?.length) {
      return data.map((row) => ({
        timestamp: row.time_bucket,
        label: new Date(row.time_bucket).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: Number(row.event_count || row.total || 0),
      }));
    }
  } catch {
    // Fallback below.
  }

  try {
    let query = supabase
      .from('events')
      .select('event_timestamp')
      .in('site_id', siteIds)
      .limit(12000);
    query = applyTimeFilter(query, 'event_timestamp', { range });
    const { data, error } = await query.order('event_timestamp', { ascending: true });
    if (error) throw error;

    const buckets = new Map();
    (data || []).forEach((row) => {
      const bucket = getTimeBucket(row.event_timestamp, range);
      if (!bucket) return;
      const current = buckets.get(bucket.key) || { label: bucket.label, count: 0 };
      current.count += 1;
      buckets.set(bucket.key, current);
    });

    return Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([timestamp, value]) => ({
        timestamp,
        label: value.label,
        count: value.count,
      }));
  } catch (err) {
    console.error('fetchEventsOverTime error:', err);
    return [];
  }
}

export async function fetchTopPages(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('v_top_pages')
      .select('*')
      .in('site_id', siteIds)
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchTopPages error:', err);
    return [];
  }
}

export async function fetchTopEventsHourly(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('v_top_events_hourly')
      .select('*')
      .in('site_id', siteIds);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchTopEventsHourly error:', err);
    return [];
  }
}

export async function fetchTopEvents(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('v_top_events')
      .select('*')
      .in('site_id', siteIds)
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchTopEvents error:', err);
    return [];
  }
}

export async function fetchSessionDistribution(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    // The view groups by site_id and duration_bucket
    const { data, error } = await supabase
      .from('v_session_distribution')
      .select('duration_bucket, sessions')
      .in('site_id', siteIds);
    
    if (error) throw error;

    // Aggregate further in case multiple sites are selected
    const aggregated = {};
    (data || []).forEach(row => {
      aggregated[row.duration_bucket] = (aggregated[row.duration_bucket] || 0) + Number(row.sessions || 0);
    });
    
    return Object.entries(aggregated).map(([bucket, count]) => ({
      duration_bucket: bucket,
      sessions: count
    }));
  } catch (err) {
    console.error('fetchSessionDistribution error:', err);
    return [];
  }
}

export async function fetchDeviceBrowser(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('v_device_browser')
      .select('browser, users')
      .in('site_id', siteIds);
    
    if (error) throw error;

    // Aggregate by browser across selected sites
    const aggregated = {};
    (data || []).forEach(row => {
      const browser = row.browser || 'Unknown';
      aggregated[browser] = (aggregated[browser] || 0) + Number(row.users || 0);
    });

    return Object.entries(aggregated)
      .map(([browser, users]) => ({ browser, users }))
      .sort((a, b) => b.users - a.users);
  } catch (err) {
    console.error('fetchDeviceBrowser error:', err);
    return [];
  }
}


export async function fetchScrollDepth(siteIds, range = '24h') {
  const defaultSeries = [25, 50, 75, 100].map((milestone) => ({
    milestone,
    users: 0,
    percentage: 0,
  }));
  if (!Array.isArray(siteIds) || siteIds.length === 0) return defaultSeries;

  try {
    let query = supabase
      .from('events')
      .select('session_id, event_type, event_timestamp, metadata')
      .in('site_id', siteIds)
      .limit(15000);
    query = applyTimeFilter(query, 'event_timestamp', { range });
    const { data, error } = await query;
    if (error) throw error;

    const allSessions = new Set();
    const maxDepthBySession = new Map();

    (data || []).forEach((row) => {
      if (!row.session_id) return;
      allSessions.add(row.session_id);
      if (row.event_type !== 'scroll_depth') return;

      const depth = Number(row.metadata?.scroll_percent || row.metadata?.depth || 0);
      const safeDepth = clamp(depth, 0, 100);
      const current = maxDepthBySession.get(row.session_id) || 0;
      if (safeDepth > current) {
        maxDepthBySession.set(row.session_id, safeDepth);
      }
    });

    const totalUsers = allSessions.size || 1;
    return [25, 50, 75, 100].map((milestone) => {
      let users = 0;
      maxDepthBySession.forEach((value) => {
        if (value >= milestone) users += 1;
      });
      return {
        milestone,
        users,
        percentage: Math.round((users / totalUsers) * 100),
      };
    });
  } catch (err) {
    console.error('fetchScrollDepth error:', err);
    return defaultSeries;
  }
}

export async function fetchDeviceAnalytics(siteIds, range = '24h') {
  if (!Array.isArray(siteIds) || siteIds.length === 0) {
    return { browsers: [], screens: [] };
  }

  try {
    let query = supabase
      .from('events')
      .select('session_id, event_timestamp, metadata, sessions ( device_info )')
      .in('site_id', siteIds)
      .limit(15000);
    query = applyTimeFilter(query, 'event_timestamp', { range });
    const { data, error } = await query;
    if (error) throw error;

    const bySession = new Map();
    (data || []).forEach((row) => {
      if (!row.session_id || bySession.has(row.session_id)) return;
      const session = normalizeRelation(row.sessions);
      const meta = row.metadata || {};
      const deviceInfo = session?.device_info || {};
      bySession.set(row.session_id, {
        browser: meta.browser || deviceInfo.browser || 'Unknown',
        screen: meta.screen || deviceInfo.screen || 'Unknown',
      });
    });

    const browserCounts = {};
    const screenCounts = {};
    bySession.forEach((entry) => {
      browserCounts[entry.browser] = (browserCounts[entry.browser] || 0) + 1;
      screenCounts[entry.screen] = (screenCounts[entry.screen] || 0) + 1;
    });

    return {
      browsers: Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count),
      screens: Object.entries(screenCounts)
        .map(([screen, count]) => ({ screen, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    };
  } catch (err) {
    console.error('fetchDeviceAnalytics error:', err);
    return { browsers: [], screens: [] };
  }
}

export async function fetchConversionOverTime(siteIds) {
  if (!Array.isArray(siteIds) || siteIds.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('v_conversion_over_time')
      .select('*')
      .in('site_id', siteIds);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('fetchConversionOverTime error:', err);
    return [];
  }
}

export async function fetchFunnelData(siteIds) {
  const empty = [
    { step: 'page_views', count: 0, dropoff: 0 },
    { step: 'clicks', count: 0, dropoff: 0 },
    { step: 'conversions', count: 0, dropoff: 0 },
  ];
  if (!Array.isArray(siteIds) || siteIds.length === 0) return empty;

  try {
    const { data, error } = await supabase
      .from('v_conversion_funnel')
      .select('*')
      .in('site_id', siteIds);
    if (error) throw error;

    let pageViews = 0;
    let clicks = 0;
    let conversions = 0;

    (data || []).forEach(row => {
      pageViews += Number(row.page_views || 0);
      clicks += Number(row.clicks || 0);
      conversions += Number(row.conversions || 0);
    });

    const sequence = [
      { step: 'page_views', count: pageViews },
      { step: 'clicks', count: clicks },
      { step: 'conversions', count: conversions },
    ];

    return sequence.map((row, idx) => {
      if (idx === 0) return { ...row, dropoff: 0 };
      const prev = sequence[idx - 1].count || 1;
      const dropoff = Math.max(0, Math.round(((prev - row.count) / prev) * 100));
      return { ...row, dropoff };
    });
  } catch (err) {
    console.error('fetchFunnelData error:', err);
    return empty;
  }
}

export async function fetchRecentActivitySummary(siteIds, range = '24h', limit = 20, search = '') {
  const events = await fetchLiveEvents({
    siteIds,
    eventType: 'all',
    limit: Math.max(limit, 20),
    since: getRangeStart(range),
    search,
  });

  const grouped = {};
  events.forEach((event) => {
    const key = `${event.event_type}-${event.domain || event.site_name || 'unknown'}`;
    if (!grouped[key]) {
      grouped[key] = {
        id: key,
        event_type: event.event_type,
        domain: event.domain,
        site_name: event.site_name,
        count: 0,
        last_seen: event.event_timestamp,
      };
    }
    grouped[key].count += 1;
    if (new Date(event.event_timestamp) > new Date(grouped[key].last_seen)) {
      grouped[key].last_seen = event.event_timestamp;
    }
  });

  return Object.values(grouped)
    .sort((a, b) => new Date(b.last_seen) - new Date(a.last_seen))
    .slice(0, limit);
}

export function exportRowsAsCsv(rows, filename = 'digiprint-export.csv') {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Data Explorer – whitelisted query registry + execution
// ---------------------------------------------------------------------------

import { api } from '../services/api';

/**
 * Centralized registry of all playground queries for the UI.
 * The actual SQL and execution happens securely on the backend.
 */
export const PLAYGROUND_QUERIES = [
  {
    id: 'total_events',
    name: 'Total Events Count',
    description: 'Get the total number of events tracked across your sites',
    type: 'aggregate',
    emptyMessage: 'No events tracked yet for your sites.',
  },
  {
    id: 'events_by_type',
    name: 'Events by Type',
    description: 'Count of events grouped by event type',
    type: 'distribution',
    emptyMessage: 'No event type data available yet.',
  },
  {
    id: 'active_users',
    name: 'Active Users (Last 7 Days)',
    description: 'Users with activity in the past 7 days',
    type: 'users',
    emptyMessage: 'No active users found in the last 7 days.',
  },
  {
    id: 'avg_session_duration',
    name: 'Average Session Duration',
    description: 'Average session duration by user across your sites',
    type: 'aggregate',
    emptyMessage: 'No session duration data available.',
  },
  {
    id: 'hourly_distribution',
    name: 'Hourly Event Distribution',
    description: 'Events grouped by hour of day',
    type: 'timeseries',
    emptyMessage: 'No hourly distribution data available.',
  },
  {
    id: 'user_event_summary',
    name: 'User Event Summary',
    description: 'Comprehensive user activity statistics',
    type: 'summary',
    emptyMessage: 'No user event summary data found.',
  },
  {
    id: 'anomalies',
    name: 'Recent Anomalies',
    description: 'Sessions flagged as anomalous (z-score > 2)',
    type: 'security',
    emptyMessage: 'No anomalies detected. Your sites look healthy! ✅',
  },
  {
    id: 'risk_scores',
    name: 'Risk Score Distribution',
    description: 'Count of sessions by risk level',
    type: 'security',
    emptyMessage: 'No risk score data available.',
  },
  {
    id: 'peak_activity',
    name: 'Peak Activity Hours',
    description: 'Busiest hours of day on your sites',
    type: 'timeseries',
    emptyMessage: 'No peak activity data yet.',
  },
];

/**
 * Execute a whitelisted playground query securely via the backend API.
 * User isolation is enforced by the backend using the inferred JWT.
 *
 * @param {string}   queryId  - key from PLAYGROUND_QUERIES
 * @returns {{ rows: object[], executionMs: number, rowCount: number }}
 */
export async function executePlaygroundQuery(queryId) {
  const meta = PLAYGROUND_QUERIES.find((q) => q.id === queryId);
  if (!meta) throw new Error(`Query "${queryId}" is not in the UI whitelist.`);

  const start = Date.now();
  
  try {
    const data = await api.executeQuery(queryId);
    
    if (!data.success) {
      throw new Error(data.error || 'Server returned an error');
    }
    
    const rows = data.rows || [];
    return {
      rows: rows,
      executionMs: data.executionMs !== undefined ? data.executionMs : (Date.now() - start),
      rowCount: rows.length,
    };
  } catch (err) {
    const message = err.error || err.response?.data?.error || err.message || 'Failed to execute query';
    throw new Error(message);
  }
}


