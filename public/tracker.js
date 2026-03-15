// DigiPrint Universal Tracker
// Standalone script for external websites — loaded via <script> tag

(async function () {

    const script = document.currentScript
    const domain = script.getAttribute("data-domain")
    const SUPABASE_URL = script.getAttribute("data-supabase-url")
    const SUPABASE_ANON_KEY = script.getAttribute("data-supabase-key")

    if (!domain) {
        console.warn("DigiPrint: data-domain attribute missing")
        return
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn("DigiPrint: Supabase credentials missing from script attributes")
        return
    }

    const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
    )

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    let siteId = null
    let sessionId = null

    async function init() {

        const { data: site } = await supabase
            .from("sites")
            .select("id")
            .eq("domain", domain)
            .single()

        if (!site) {
            console.warn("DigiPrint: site not registered —", domain)
            return
        }

        siteId = site.id

        const { data: session } = await supabase
            .from("sessions")
            .insert({
                site_id: siteId,
                device_info: {
                    browser: navigator.userAgent,
                    screen: `${window.innerWidth}x${window.innerHeight}`
                }
            })
            .select()
            .single()

        if (!session) {
            console.warn("DigiPrint: failed to create session")
            return
        }

        sessionId = session.id

        track("session_start", { page: location.pathname })

        setupTracking()
    }

    async function track(type, metadata = {}) {

        if (!siteId || !sessionId) return

        await supabase.from("events").insert({
            site_id: siteId,
            session_id: sessionId,
            event_type: type,
            metadata
        })
    }

    function setupTracking() {

        track("page_view", { page: location.pathname })

        document.addEventListener("click", (e) => {

            track("click", {
                element: e.target.tagName,
                page: location.pathname
            })

        })

        document.querySelectorAll("form").forEach(form => {

            form.addEventListener("submit", () => {

                track("search", { page: location.pathname })

            })

        })

    }

    init()

})()
