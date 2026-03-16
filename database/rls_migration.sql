-- ============================================
-- DigiPrint RLS Migration (v2)
-- Uses: user_id on sites, RLS policies
-- event_type is plain TEXT (no CHECK constraint)
-- Run this in the Supabase SQL Editor
-- ============================================

-- ======================
-- ADD user_id TO sites (if missing)
-- ======================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'sites' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE sites ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);

-- ======================
-- (Optional) Drop legacy owner_id if it exists
-- ======================
-- DO $$
-- BEGIN
--     IF EXISTS (
--         SELECT 1 FROM information_schema.columns
--         WHERE table_name = 'sites' AND column_name = 'owner_id'
--     ) THEN
--         -- Migrate data first
--         UPDATE sites SET user_id = owner_id WHERE user_id IS NULL AND owner_id IS NOT NULL;
--         ALTER TABLE sites DROP COLUMN owner_id;
--     END IF;
-- END $$;

-- ======================
-- (Optional) Assign existing sites to a specific user.
-- Replace '<YOUR_USER_UUID>' with a real auth.users id if needed.
-- ======================
-- UPDATE sites SET user_id = '<YOUR_USER_UUID>' WHERE user_id IS NULL;

-- ======================
-- ENABLE ROW LEVEL SECURITY
-- ======================
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ======================
-- SITES POLICIES
-- ======================
-- Authenticated users can only see their own sites
DROP POLICY IF EXISTS "Users see own sites" ON sites;
CREATE POLICY "Users see own sites"
    ON sites FOR SELECT
    USING (user_id = auth.uid());

-- Authenticated users can insert sites (user_id set on insert)
DROP POLICY IF EXISTS "Users insert own sites" ON sites;
CREATE POLICY "Users insert own sites"
    ON sites FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Authenticated users can update their own sites
DROP POLICY IF EXISTS "Users update own sites" ON sites;
CREATE POLICY "Users update own sites"
    ON sites FOR UPDATE
    USING (user_id = auth.uid());

-- ======================
-- SESSIONS POLICIES
-- ======================
-- Users can see sessions belonging to their sites
DROP POLICY IF EXISTS "Users see own sessions" ON sessions;
CREATE POLICY "Users see own sessions"
    ON sessions FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- Anon/service role can insert sessions (tracker script uses anon key)
DROP POLICY IF EXISTS "Anon insert sessions" ON sessions;
CREATE POLICY "Anon insert sessions"
    ON sessions FOR INSERT
    WITH CHECK (true);

-- ======================
-- EVENTS POLICIES
-- ======================
-- Users can see events belonging to their sites
DROP POLICY IF EXISTS "Users see own events" ON events;
CREATE POLICY "Users see own events"
    ON events FOR SELECT
    USING (
        site_id IN (SELECT id FROM sites WHERE user_id = auth.uid())
    );

-- Anon/service role can insert events (tracker script uses anon key)
DROP POLICY IF EXISTS "Anon insert events" ON events;
CREATE POLICY "Anon insert events"
    ON events FOR INSERT
    WITH CHECK (true);

-- ======================
-- REMOVE event_type CHECK constraint if it exists
-- Analytics systems should never constrain event types.
-- event_type is plain TEXT — any value is allowed.
-- ======================
DO $$
BEGIN
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_event_type_check;
EXCEPTION WHEN others THEN
    RAISE NOTICE 'No event_type constraint to drop: %', SQLERRM;
END $$;
