const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Try to load frontend .env for the SUPABASE_ANON_KEY if not in backend environment
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wufarfidmvjsncvhjuzo.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
    console.error('⚠️ SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY is missing in backend environment!');
    console.error('⚠️ The server will start, but queries/auth will fail until it is set in Render Env Vars.');
}

// Base client for auth verification - only initialize if key exists
const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const authenticateUser = async (req, res, next) => {
    if (!supabase) {
        return res.status(500).json({ success: false, error: 'Server authentication misconfigured (missing Supabase keys in Render Dashboard)' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token', message: error?.message });
        }
        
        req.user = user;
        req.token = token; // Store token for downstream scoped-client instantiation
        next();
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Authentication failed' });
    }
};

module.exports = { authenticateUser, supabaseUrl, supabaseKey };
