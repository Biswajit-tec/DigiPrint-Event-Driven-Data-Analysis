// DigiPrint Universal Tracker v3
// Standalone script for external websites — loaded via <script> tag
// Tracks: page_view, click, scroll_depth, form_submit, navigation,
//         session_start, session_end, hover, download, external_link_click,
//         search, login, logout, api_call, rage_click

(async function () {

    const script = document.currentScript;
    const domain = script.getAttribute("data-domain");
    const SUPABASE_URL = script.getAttribute("data-supabase-url");
    const SUPABASE_ANON_KEY = script.getAttribute("data-supabase-key");

    if (!domain) {
        console.warn("DigiPrint: data-domain attribute missing");
        return;
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("DigiPrint: Supabase credentials missing from script attributes");
        return;
    }

    const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
    );

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        },
    });

    let siteId = null;
    let sessionId = null;

    // ─── Event Batching Queue ──────────────────────────────────
    const eventQueue = [];
    const BATCH_INTERVAL = 2000; // flush every 2 seconds

    async function flushQueue() {
        if (!eventQueue.length || !siteId || !sessionId) return;

        const batch = eventQueue.splice(0, eventQueue.length);
        try {
            await supabase.from("events").insert(batch);
        } catch (err) {
            console.warn("DigiPrint: batch insert failed", err);
            // Re-queue failed events (front of queue)
            eventQueue.unshift(...batch);
        }
    }

    // Flush periodically
    setInterval(flushQueue, BATCH_INTERVAL);

    // ─── Initialize ────────────────────────────────────────────

    async function init() {
        const { data: site } = await supabase
            .from("sites")
            .select("id")
            .eq("domain", domain)
            .single();

        if (!site) {
            console.warn("DigiPrint: site not registered —", domain);
            return;
        }

        siteId = site.id;

        const { data: session } = await supabase
            .from("sessions")
            .insert({
                site_id: siteId,
                device_info: {
                    browser: navigator.userAgent,
                    os: navigator.platform,
                    screen: `${window.innerWidth}x${window.innerHeight}`,
                },
            })
            .select()
            .single();

        if (!session) {
            console.warn("DigiPrint: failed to create session");
            return;
        }

        sessionId = session.id;

        track("session_start", { page: location.pathname });
        setupTracking();
    }

    // ─── Core tracking function ────────────────────────────────
    // Queues events for batched insert. Does NOT send event_timestamp
    // — the database column uses DEFAULT now().

    function track(type, metadata = {}) {
        if (!siteId || !sessionId) return;

        eventQueue.push({
            site_id: siteId,
            session_id: sessionId,
            event_type: type,
            metadata,
        });
    }

    // ─── Event tracking setup ──────────────────────────────────

    function setupTracking() {
        // 1. Page View
        track("page_view", { page: location.pathname, title: document.title });

        // 2. Click tracking (with element details) + download + external link
        setupClickTracking();

        // 3. Form submission tracking (includes search, login, logout detection)
        setupFormTracking();

        // 4. Scroll milestone tracking
        setupScrollTracking();

        // 5. Navigation tracking (SPA support)
        setupNavigationTracking();

        // 6. Hover tracking on interactive elements
        setupHoverTracking();

        // 7. API call interception
        setupApiCallTracking();

        // 8. Rage click detection
        setupRageClickTracking();

        // 9. Session end on page unload — flush remaining events
        window.addEventListener("beforeunload", () => {
            track("session_end", { page: location.pathname });
            // Synchronous flush attempt using sendBeacon
            if (eventQueue.length && navigator.sendBeacon) {
                const batch = eventQueue.splice(0, eventQueue.length);
                const payload = JSON.stringify(batch);
                // sendBeacon to Supabase REST API
                const url = `${SUPABASE_URL}/rest/v1/events`;
                const blob = new Blob([payload], { type: "application/json" });
                navigator.sendBeacon(url + `?apikey=${SUPABASE_ANON_KEY}`, blob);
            } else {
                flushQueue();
            }
        });
    }

    // ─── Click Tracking ───────────────────────────────────────

    function setupClickTracking() {
        document.addEventListener("click", (e) => {
            const el = e.target;
            const meta = {
                element: el.tagName,
                page: location.pathname,
            };
            if (el.id) meta.element_id = el.id;
            if (el.textContent) meta.text = el.textContent.trim().slice(0, 50);
            if (el.className && typeof el.className === 'string') meta.element_class = el.className.slice(0, 80);

            // Check for download links
            if (el.tagName === 'A' || el.closest('a')) {
                const anchor = el.tagName === 'A' ? el : el.closest('a');
                const href = anchor?.href || '';

                // Download detection
                if (/\.(pdf|zip|rar|7z|doc|docx|xls|xlsx|ppt|pptx|csv|tar|gz|dmg|exe|msi|apk|ipa)$/i.test(href)) {
                    track("download", { file: href.split('/').pop(), url: href, page: location.pathname });
                }

                // External link detection
                try {
                    const linkDomain = new URL(href).hostname;
                    if (linkDomain && linkDomain !== location.hostname) {
                        track("external_link_click", { url: href, domain: linkDomain, page: location.pathname });
                    }
                } catch {
                    // Invalid URL, skip
                }
            }

            track("click", meta);
        });
    }

    // ─── Form Tracking (form_submit, search, login, logout) ───

    function setupFormTracking() {
        document.addEventListener("submit", (e) => {
            const form = e.target;
            const meta = {
                page: location.pathname,
            };
            if (form.id) meta.formId = form.id;
            if (form.action) meta.action = form.action;
            if (form.method) meta.method = form.method;

            // Detect form type
            const formHtml = form.innerHTML.toLowerCase();
            const formAction = (form.action || '').toLowerCase();
            const formId = (form.id || '').toLowerCase();
            const formClass = (form.className || '').toLowerCase();
            const allText = `${formId} ${formClass} ${formAction} ${formHtml}`;

            // Search form detection
            const searchInput = form.querySelector('input[type="search"], input[name*="search"], input[name*="query"], input[name*="q"]');
            if (searchInput) {
                const query = searchInput.value?.trim();
                if (query) {
                    track("search", { query, page: location.pathname });
                }
            }

            // Login form detection
            if (/login|sign.?in|auth/i.test(allText)) {
                track("login", { page: location.pathname });
            }

            // Logout detection
            if (/logout|sign.?out/i.test(allText)) {
                track("logout", { page: location.pathname });
            }

            track("form_submit", meta);
        }, true);

        // Also track search on Enter in search inputs outside forms
        document.addEventListener("keydown", (e) => {
            if (e.key !== "Enter") return;
            const el = e.target;
            if (el.tagName !== "INPUT") return;
            const type = (el.type || '').toLowerCase();
            const name = (el.name || '').toLowerCase();
            if (type === "search" || /search|query/.test(name)) {
                const query = el.value?.trim();
                if (query) {
                    track("search", { query, page: location.pathname });
                }
            }
        });
    }

    // ─── Scroll Milestones (scroll_depth) ─────────────────────
    // Each milestone fires only once per page (uses Set).

    function setupScrollTracking() {
        const milestones = [25, 50, 75, 100];
        const reached = new Set();

        const checkScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

            for (const milestone of milestones) {
                if (scrollPercent >= milestone && !reached.has(milestone)) {
                    reached.add(milestone);
                    track("scroll_depth", { scroll_percent: milestone, page: location.pathname });
                }
            }
        };

        let ticking = false;
        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ─── Navigation tracking (History API) ─────────────────────

    function setupNavigationTracking() {
        let lastPath = location.pathname;

        const onNavigate = () => {
            const newPath = location.pathname;
            if (newPath !== lastPath) {
                track("navigation", { from: lastPath, to: newPath });
                track("page_view", { page: newPath, title: document.title });
                lastPath = newPath;
            }
        };

        // Monkey-patch pushState and replaceState
        const origPushState = history.pushState;
        history.pushState = function () {
            origPushState.apply(this, arguments);
            onNavigate();
        };

        const origReplaceState = history.replaceState;
        history.replaceState = function () {
            origReplaceState.apply(this, arguments);
            onNavigate();
        };

        window.addEventListener("popstate", onNavigate);
    }

    // ─── Hover tracking (>1 second on interactive elements) ────

    function setupHoverTracking() {
        let hoverTimer = null;
        let hoveredEl = null;

        document.addEventListener("mouseover", (e) => {
            const target = e.target.closest("a, button, input, select, textarea, [role='button']");
            if (!target || target === hoveredEl) return;

            // Clear previous timer
            if (hoverTimer) clearTimeout(hoverTimer);
            hoveredEl = target;

            hoverTimer = setTimeout(() => {
                const meta = {
                    element: target.tagName,
                    page: location.pathname,
                    duration: 1,
                };
                if (target.id) meta.element_id = target.id;
                if (target.textContent) meta.text = target.textContent.trim().slice(0, 50);
                track("hover", meta);
            }, 1000);
        });

        document.addEventListener("mouseout", (e) => {
            const target = e.target.closest("a, button, input, select, textarea, [role='button']");
            if (target === hoveredEl) {
                if (hoverTimer) clearTimeout(hoverTimer);
                hoveredEl = null;
            }
        });
    }

    // ─── API Call Interception ─────────────────────────────────
    // Intercepts fetch() and XMLHttpRequest. Excludes Supabase URLs
    // to prevent recursion.

    function setupApiCallTracking() {
        const isSupabaseUrl = (url) => {
            if (!url) return false;
            const s = url.toLowerCase();
            return s.includes("supabase.co") || s.includes("rest/v1") || s.includes("realtime");
        };

        // Intercept fetch
        const origFetch = window.fetch;
        window.fetch = function (input, init) {
            const url = typeof input === 'string' ? input : input?.url || '';
            if (!isSupabaseUrl(url)) {
                track("api_call", {
                    endpoint: url.split('?')[0].slice(0, 200),
                    method: (init?.method || 'GET').toUpperCase(),
                    page: location.pathname,
                });
            }
            return origFetch.apply(this, arguments);
        };

        // Intercept XMLHttpRequest
        const origXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (!isSupabaseUrl(url)) {
                track("api_call", {
                    endpoint: String(url).split('?')[0].slice(0, 200),
                    method: (method || 'GET').toUpperCase(),
                    page: location.pathname,
                });
            }
            return origXhrOpen.apply(this, arguments);
        };
    }

    // ─── Rage Click Detection ─────────────────────────────────
    // 3+ clicks on the same element within 1 second.

    function setupRageClickTracking() {
        const clickLog = [];

        document.addEventListener("click", (e) => {
            const now = Date.now();
            const el = e.target;

            // Remove old clicks (>1 second ago)
            while (clickLog.length && now - clickLog[0].time > 1000) {
                clickLog.shift();
            }

            clickLog.push({ time: now, target: el });

            // Count clicks on the same element
            const sameElementClicks = clickLog.filter(c => c.target === el).length;

            if (sameElementClicks >= 3) {
                const meta = {
                    element: el.tagName,
                    page: location.pathname,
                    clicks: sameElementClicks,
                };
                if (el.id) meta.element_id = el.id;
                if (el.textContent) meta.text = el.textContent.trim().slice(0, 50);
                if (el.className && typeof el.className === 'string') meta.element_class = el.className.slice(0, 80);
                track("rage_click", meta);

                // Clear log to avoid repeated firing
                clickLog.length = 0;
            }
        });
    }

    // ─── Start ─────────────────────────────────────────────────

    init();

})();
