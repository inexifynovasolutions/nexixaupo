// ============================================================
// Nexi Rocket-XauPo — Supabase Client Configuration
// File: supabase-config.js
// ============================================================

const SUPABASE_URL = 'https://awiduhclxuxkqkxrgfub.supabase.co';
const SUPABASE_KEY = 'sb_publishable_D44mLJQb87KSHfN_9lQTHg_hvAzRavv';

// Supabase client (CDN se aata hai — HTML mein script tag lagayenge)
let supabaseClient = null;

// Initialize function — jab bhi zaroorat ho call karein
function initSupabase() {
    if (supabaseClient) return supabaseClient;
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase CDN not loaded!');
        return null;
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return supabaseClient;
}

// ============================================================
// HELPER FUNCTIONS — Users
// ============================================================

async function getUserByEmail(email) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();
    if (error) { console.error('getUserByEmail error:', error); return null; }
    return data;
}

async function getUserBySecretKey(secretKey) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('users')
        .select('*')
        .eq('secret_key', secretKey)
        .maybeSingle();
    if (error) { console.error('getUserBySecretKey error:', error); return null; }
    return data;
}

async function createUser(userData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('users')
        .insert([userData])
        .select()
        .single();
    if (error) { console.error('createUser error:', error); return { error }; }
    return { data };
}

async function createPayment(paymentData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('payments')
        .insert([paymentData])
        .select()
        .single();
    if (error) { console.error('createPayment error:', error); return { error }; }
    return { data };
}

async function getAllUsers() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllUsers error:', error); return []; }
    return data || [];
}

async function getAllPayments() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllPayments error:', error); return []; }
    return data || [];
}

// ============================================================
// HELPER FUNCTIONS — Settings
// ============================================================

async function getSetting(key, defaultValue = null) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
    if (error) {
        console.error('getSetting error:', error);
        return defaultValue;
    }
    return data ? data.value : defaultValue;
}

async function getAllSettings() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('settings')
        .select('*')
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
    if (error) {
        console.error('getAllSettings error:', error);
        return [];
    }
    return data || [];
}

async function updateSetting(key, value) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('settings')
        .update({ value: String(value), updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();
    if (error) {
        console.error('updateSetting error:', error);
        return { error };
    }
    return { data };
}

let _cachedFreeTrades = null;

async function getFreeTradesPerDay() {
    if (_cachedFreeTrades !== null) return _cachedFreeTrades;
    const val = await getSetting('free_trades_per_day', '3');
    _cachedFreeTrades = parseInt(val) || 3;
    return _cachedFreeTrades;
}

// ============================================================
// HELPER FUNCTIONS — Alerts
// ============================================================

// Active alerts laao (frontend ke liye) — time filter ke saath
async function getActiveAlerts(target = 'both') {
    const sb = initSupabase();
    const now = new Date().toISOString();

    let query = sb
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    // Target filter: 'both' wale sab ko dikhein, specific target bhi
    if (target === 'demo') {
        query = query.in('target', ['demo', 'both']);
    } else if (target === 'clients') {
        query = query.in('target', ['clients', 'both']);
    }
    // Agar target 'both' hai to filter nahi lagayenge (saare)

    const { data, error } = await query;
    if (error) {
        console.error('getActiveAlerts error:', error);
        return [];
    }

    // Client-side time filter (start_time aur end_time)
    const filtered = (data || []).filter(a => {
        if (a.start_time && new Date(a.start_time) > new Date()) return false;
        if (a.end_time && new Date(a.end_time) < new Date()) return false;
        return true;
    });

    return filtered;
}

// Saare alerts laao (admin panel ke liye)
async function getAllAlerts() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('getAllAlerts error:', error);
        return [];
    }
    return data || [];
}

// Naya alert banao
async function createAlert(alertData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alerts')
        .insert([alertData])
        .select()
        .single();
    if (error) {
        console.error('createAlert error:', error);
        return { error };
    }
    return { data };
}

// Alert update karo
async function updateAlert(id, updates) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alerts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('updateAlert error:', error);
        return { error };
    }
    return { data };
}

// Alert delete karo
async function deleteAlert(id) {
    const sb = initSupabase();
    const { error } = await sb
        .from('alerts')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('deleteAlert error:', error);
        return { error };
    }
    return { success: true };
}

console.log('✅ supabase-config.js loaded');