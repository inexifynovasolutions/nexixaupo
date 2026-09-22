// ============================================================
// Nexi Rocket-XauPo — Supabase Client Configuration
// File: supabase-config.js
// Version: v3 (Supabase Auth Migration — Phase B2)
// ============================================================

// ⚠️ IMPORTANT: In values ko aage chalke environment variables mein move karenge
// (Phase C — Infrastructure)
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
// 🆕 SUPABASE AUTH HELPERS (Phase B2 — Migration)
// ============================================================
// Ye helpers Supabase Auth (auth.users) ke saath kaam karte hain.
// Custom auth (users table) ki jagah ye use honge.

// ------------------------------------------------------------
// 1. SIGN UP — Naya user register karein
// ------------------------------------------------------------
// @param {string} email — User ka email
// @param {string} password — User ka password (bcrypt mein store hoga)
// @param {object} metadata — Extra info (name, phone, capital, secret_key)
// @returns {object} — { data, error }
async function signUpUser(email, password, metadata = {}) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: { message: 'Supabase init failed' } };

        const { data, error } = await sb.auth.signUp({
            email: email.toLowerCase().trim(),
            password: password,
            options: {
                data: metadata  // name, phone, capital, secret_key yahan aayenge
            }
        });

        if (error) {
            console.error('signUpUser error:', error);
            return { error };
        }

        console.log('✅ signUpUser success:', data.user?.email);
        return { data };
    } catch (err) {
        console.error('signUpUser exception:', err);
        return { error: { message: err.message || 'Unknown error' } };
    }
}

// ------------------------------------------------------------
// 2. SIGN IN — User login karein
// ------------------------------------------------------------
// @param {string} email — User ka email
// @param {string} password — User ka password
// @returns {object} — { data, error }
async function signInUser(email, password) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: { message: 'Supabase init failed' } };

        const { data, error } = await sb.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password: password
        });

        if (error) {
            console.error('signInUser error:', error);
            return { error };
        }

        console.log('✅ signInUser success:', data.user?.email);
        return { data };
    } catch (err) {
        console.error('signInUser exception:', err);
        return { error: { message: err.message || 'Unknown error' } };
    }
}

// ------------------------------------------------------------
// 3. SIGN OUT — User logout karein
// ------------------------------------------------------------
async function signOutUser() {
    try {
        const sb = initSupabase();
        if (!sb) return { error: { message: 'Supabase init failed' } };

        const { error } = await sb.auth.signOut();
        if (error) {
            console.error('signOutUser error:', error);
            return { error };
        }

        console.log('✅ signOutUser success');
        return { success: true };
    } catch (err) {
        console.error('signOutUser exception:', err);
        return { error: { message: err.message || 'Unknown error' } };
    }
}

// ------------------------------------------------------------
// 4. GET SESSION — Current session check karein
// ------------------------------------------------------------
// @returns {object|null} — Session ya null
async function getCurrentSession() {
    try {
        const sb = initSupabase();
        if (!sb) return null;

        const { data, error } = await sb.auth.getSession();
        if (error) {
            console.error('getCurrentSession error:', error);
            return null;
        }

        return data.session || null;
    } catch (err) {
        console.error('getCurrentSession exception:', err);
        return null;
    }
}

// ------------------------------------------------------------
// 5. GET AUTH USER — Current logged-in user
// ------------------------------------------------------------
// @returns {object|null} — Auth user ya null
async function getCurrentAuthUser() {
    try {
        const sb = initSupabase();
        if (!sb) return null;

        const { data, error } = await sb.auth.getUser();
        if (error) {
            console.error('getCurrentAuthUser error:', error);
            return null;
        }

        return data.user || null;
    } catch (err) {
        console.error('getCurrentAuthUser exception:', err);
        return null;
    }
}

// ------------------------------------------------------------
// 6. RESET PASSWORD — Password reset email bhejein
// ------------------------------------------------------------
// @param {string} email — User ka email
// @returns {object} — { data, error }
async function resetPassword(email) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: { message: 'Supabase init failed' } };

        const redirectUrl = window.location.origin + '/signin.html';

        const { data, error } = await sb.auth.resetPasswordForEmail(
            email.toLowerCase().trim(),
            { redirectTo: redirectUrl }
        );

        if (error) {
            console.error('resetPassword error:', error);
            return { error };
        }

        console.log('✅ resetPassword email sent:', email);
        return { data };
    } catch (err) {
        console.error('resetPassword exception:', err);
        return { error: { message: err.message || 'Unknown error' } };
    }
}

// ------------------------------------------------------------
// 7. UPDATE PASSWORD — Naya password set karein (logged in user)
// ------------------------------------------------------------
// @param {string} newPassword — Naya password
// @returns {object} — { data, error }
async function updatePassword(newPassword) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: { message: 'Supabase init failed' } };

        const { data, error } = await sb.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('updatePassword error:', error);
            return { error };
        }

        console.log('✅ updatePassword success');
        return { data };
    } catch (err) {
        console.error('updatePassword exception:', err);
        return { error: { message: err.message || 'Unknown error' } };
    }
}

// ------------------------------------------------------------
// 8. ON AUTH STATE CHANGE — Login/logout events ko track karein
// ------------------------------------------------------------
// @param {function} callback — (event, session) => {}
// Events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
function onAuthStateChange(callback) {
    try {
        const sb = initSupabase();
        if (!sb) return null;

        const { data } = sb.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth event:', event);
            callback(event, session);
        });

        return data.subscription;
    } catch (err) {
        console.error('onAuthStateChange exception:', err);
        return null;
    }
}

// ============================================================
// END OF PART 1/3
// ============================================================
// ============================================================
// PART 2/3 — LEGACY HELPERS (v2 se preserve kiye gaye)
// ============================================================
// ⚠️ Ye helpers abhi bhi admin.html, renewal.html,
// statistics-room.html mein use ho rahe hain.
// Phase B2 ke baad inhe gradually hata denge.
// ============================================================

// ============================================================
// HELPER FUNCTIONS — Users (Legacy Custom Auth)
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

async function getSettingWithDefault(key, defaultValue = null) {
    return await getSetting(key, defaultValue);
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

async function getActiveAlerts(target = 'both') {
    const sb = initSupabase();

    let query = sb
        .from('alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (target === 'demo') {
        query = query.in('target', ['demo', 'both']);
    } else if (target === 'clients') {
        query = query.in('target', ['clients', 'both']);
    }

    const { data, error } = await query;
    if (error) {
        console.error('getActiveAlerts error:', error);
        return [];
    }

    const now = new Date();
    const filtered = (data || []).filter(a => {
        if (a.start_time && new Date(a.start_time) > now) return false;
        if (a.end_time && new Date(a.end_time) < now) return false;
        return true;
    });

    return filtered;
}

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

// ============================================================
// HELPER FUNCTIONS — Alert Templates
// ============================================================

async function getAllTemplates(limit = 100) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alert_templates')
        .select('*')
        .order('last_used_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) {
        console.error('getAllTemplates error:', error);
        return [];
    }
    return data || [];
}

async function createTemplate(templateData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alert_templates')
        .insert([templateData])
        .select()
        .single();
    if (error) {
        console.error('createTemplate error:', error);
        return { error };
    }
    return { data };
}

async function updateTemplateUsage(id, currentCount) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('alert_templates')
        .update({
            times_used: (currentCount || 0) + 1,
            last_used_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('updateTemplateUsage error:', error);
        return { error };
    }
    return { data };
}

async function deleteTemplate(id) {
    const sb = initSupabase();
    const { error } = await sb
        .from('alert_templates')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('deleteTemplate error:', error);
        return { error };
    }
    return { success: true };
}

// ============================================================
// HELPER FUNCTIONS — Publicity Banners
// ============================================================

async function getActiveBanners(target = 'both') {
    const sb = initSupabase();

    let query = sb
        .from('publicity_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (target === 'demo') {
        query = query.in('target', ['demo', 'both']);
    } else if (target === 'clients') {
        query = query.in('target', ['clients', 'both']);
    }

    const { data, error } = await query;
    if (error) {
        console.error('getActiveBanners error:', error);
        return [];
    }

    const now = new Date();
    const filtered = (data || []).filter(b => {
        if (b.start_time && new Date(b.start_time) > now) return false;
        if (b.end_time && new Date(b.end_time) < now) return false;
        return true;
    });

    return filtered;
}

async function getAllBanners() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('publicity_banners')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('getAllBanners error:', error);
        return [];
    }
    return data || [];
}

async function createBanner(bannerData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('publicity_banners')
        .insert([bannerData])
        .select()
        .single();
    if (error) {
        console.error('createBanner error:', error);
        return { error };
    }
    return { data };
}

async function updateBanner(id, updates) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('publicity_banners')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('updateBanner error:', error);
        return { error };
    }
    return { data };
}

async function deleteBanner(id) {
    const sb = initSupabase();
    const { error } = await sb
        .from('publicity_banners')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('deleteBanner error:', error);
        return { error };
    }
    return { success: true };
}

// ============================================================
// HELPER FUNCTIONS — Banner Templates
// ============================================================

async function getBannerTemplates(limit = 100) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('banner_templates')
        .select('*')
        .order('last_used_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) {
        console.error('getBannerTemplates error:', error);
        return [];
    }
    return data || [];
}

async function saveBannerTemplate(templateData) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('banner_templates')
        .insert([templateData])
        .select()
        .single();
    if (error) {
        console.error('saveBannerTemplate error:', error);
        return { error };
    }
    return { data };
}

async function updateBannerTemplateUsage(id, currentCount) {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('banner_templates')
        .update({
            times_used: (currentCount || 0) + 1,
            last_used_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        console.error('updateBannerTemplateUsage error:', error);
        return { error };
    }
    return { data };
}

async function deleteBannerTemplate(id) {
    const sb = initSupabase();
    const { error } = await sb
        .from('banner_templates')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('deleteBannerTemplate error:', error);
        return { error };
    }
    return { success: true };
}

// ============================================================
// END OF PART 2/3
// ============================================================
// ============================================================
// PART 3/3 — NEW HELPERS (v2 se preserve) + Session Timeout
// ============================================================

// ============================================================
// HELPER FUNCTIONS — Visits
// ============================================================

async function logVisit(page = 'index', ipAddress = null) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: 'Supabase init failed' };

        const today = new Date().toISOString().split('T')[0];
        const ua = navigator.userAgent || '';

        const payload = {
            page: page,
            user_agent: ua,
            visited_date: today
        };
        if (ipAddress) payload.ip_address = ipAddress;

        const { data, error } = await sb
            .from('visits')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('logVisit error:', error);
            return { error };
        }
        return { data };
    } catch (err) {
        console.error('logVisit exception:', err);
        return { error: err };
    }
}

async function getTodayVisits() {
    try {
        const sb = initSupabase();
        if (!sb) return 0;

        const today = new Date().toISOString().split('T')[0];
        const { count, error } = await sb
            .from('visits')
            .select('*', { count: 'exact', head: true })
            .eq('visited_date', today);

        if (error) {
            console.error('getTodayVisits error:', error);
            return 0;
        }
        return count || 0;
    } catch (err) {
        console.error('getTodayVisits exception:', err);
        return 0;
    }
}

async function getVisitsGroupedByDate(limit = 30) {
    try {
        const sb = initSupabase();
        if (!sb) return [];

        const { data, error } = await sb
            .from('visits')
            .select('visited_date, ip_address')
            .order('visited_date', { ascending: false })
            .limit(5000);

        if (error) {
            console.error('getVisitsGroupedByDate error:', error);
            return [];
        }

        const grouped = {};
        (data || []).forEach(v => {
            if (!v.visited_date) return;
            if (!grouped[v.visited_date]) grouped[v.visited_date] = { total: 0, ips: new Set() };
            grouped[v.visited_date].total++;
            if (v.ip_address) grouped[v.visited_date].ips.add(v.ip_address);
        });

        return Object.keys(grouped)
            .sort()
            .reverse()
            .slice(0, limit)
            .map(date => ({
                stat_date: date,
                total_visits: grouped[date].total,
                unique_visitors: grouped[date].ips.size
            }));
    } catch (err) {
        console.error('getVisitsGroupedByDate exception:', err);
        return [];
    }
}

// ============================================================
// HELPER FUNCTIONS — Daily Stats
// ============================================================

async function getDailyStats(limit = 30) {
    try {
        const sb = initSupabase();
        if (!sb) return [];

        const { data, error } = await sb
            .from('daily_stats')
            .select('*')
            .order('stat_date', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('getDailyStats error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('getDailyStats exception:', err);
        return [];
    }
}

async function saveDailyStats(statsData) {
    try {
        const sb = initSupabase();
        if (!sb) return { error: 'Supabase init failed' };

        const payload = {
            ...statsData,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await sb
            .from('daily_stats')
            .upsert([payload], { onConflict: 'stat_date' })
            .select()
            .single();

        if (error) {
            console.error('saveDailyStats error:', error);
            return { error };
        }
        return { data };
    } catch (err) {
        console.error('saveDailyStats exception:', err);
        return { error: err };
    }
}

async function getOverallWinRate(days = 30) {
    try {
        const sb = initSupabase();
        if (!sb) return '0%';

        const { data, error } = await sb
            .from('daily_stats')
            .select('win_trades, total_trades')
            .order('stat_date', { ascending: false })
            .limit(days);

        if (error) {
            console.error('getOverallWinRate error:', error);
            return '0%';
        }

        let totWins = 0, totTrades = 0;
        (data || []).forEach(d => {
            totWins += parseInt(d.win_trades) || 0;
            totTrades += parseInt(d.total_trades) || 0;
        });

        return totTrades > 0 ? ((totWins / totTrades) * 100).toFixed(1) + '%' : '0%';
    } catch (err) {
        console.error('getOverallWinRate exception:', err);
        return '0%';
    }
}

// ============================================================
// HELPER FUNCTIONS — Signals
// ============================================================

async function getActiveSignals(target = 'clients', limit = 10) {
    try {
        const sb = initSupabase();
        if (!sb) return [];

        let query = sb
            .from('signals')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (target === 'demo') {
            query = query.in('target', ['demo', 'both']);
        } else if (target === 'clients') {
            query = query.in('target', ['clients', 'both']);
        }

        const { data, error } = await query;
        if (error) {
            console.error('getActiveSignals error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('getActiveSignals exception:', err);
        return [];
    }
}

async function getAllSignals() {
    try {
        const sb = initSupabase();
        if (!sb) return [];

        const { data, error } = await sb
            .from('signals')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('getAllSignals error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('getAllSignals exception:', err);
        return [];
    }
}

async function getTotalSignalsCount() {
    try {
        const sb = initSupabase();
        if (!sb) return 0;

        const { count, error } = await sb
            .from('signals')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('getTotalSignalsCount error:', error);
            return 0;
        }
        return count || 0;
    } catch (err) {
        console.error('getTotalSignalsCount exception:', err);
        return 0;
    }
}

// ============================================================
// HELPER FUNCTIONS — Clients Count
// ============================================================

async function getActiveClientsCount() {
    try {
        const sb = initSupabase();
        if (!sb) return 0;

        const { count, error } = await sb
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        if (error) {
            console.error('getActiveClientsCount error:', error);
            return 0;
        }
        return count || 0;
    } catch (err) {
        console.error('getActiveClientsCount exception:', err);
        return 0;
    }
}

async function getTotalClientsCount() {
    try {
        const sb = initSupabase();
        if (!sb) return 0;

        const { count, error } = await sb
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('getTotalClientsCount error:', error);
            return 0;
        }
        return count || 0;
    } catch (err) {
        console.error('getTotalClientsCount exception:', err);
        return 0;
    }
}

// ============================================================
// HELPER FUNCTIONS — Trades
// ============================================================

async function getTradesBetween(startISO, endISO) {
    try {
        const sb = initSupabase();
        if (!sb) return [];

        const { data, error } = await sb
            .from('trades')
            .select('profit, exit, created_at')
            .gte('created_at', startISO)
            .lte('created_at', endISO)
            .not('exit', 'is', null);

        if (error) {
            console.error('getTradesBetween error:', error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error('getTradesBetween exception:', err);
        return [];
    }
}

// ============================================================
// VERSION LOG
// ============================================================
console.log('✅ supabase-config.js v3 loaded — Supabase Auth + Legacy + Session');

// ============================================================
// SESSION TIMEOUT SYSTEM (B6 — Phase B Security)
// ============================================================
// Config: 30 min inactivity → warning at 29 min → auto logout at 30 min

const SESSION_CONFIG = {
    TIMEOUT_MINUTES: 30,
    WARNING_BEFORE_SECONDS: 60,
    ACTIVITY_EVENTS: ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'],
    CHECK_INTERVAL_SECONDS: 10
};

let _sessionState = {
    lastActivity: Date.now(),
    warningShown: false,
    timeoutTimer: null,
    warningTimer: null,
    intervalTimer: null,
    active: false,
    onLogout: null,
    warningElement: null
};

function initSessionTimeout(onLogoutCallback, redirectUrl = 'signin.html') {
    if (_sessionState.active) return;
    _sessionState.active = true;
    _sessionState.lastActivity = Date.now();
    _sessionState.onLogout = onLogoutCallback || function() {
        localStorage.removeItem('nexiCurrentUser');
        sessionStorage.removeItem('nexiAdmin');
        alert('⏰ Session expired — 30 minutes of inactivity.\n\nPlease login again.');
        window.location.replace(redirectUrl);
    };
    createWarningElement();
    SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
        document.addEventListener(event, handleUserActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    _sessionState.intervalTimer = setInterval(checkSession, SESSION_CONFIG.CHECK_INTERVAL_SECONDS * 1000);
    console.log('✅ Session timeout initialized — 30 min inactivity');
}

function handleUserActivity() {
    if (!_sessionState.active) return;
    _sessionState.lastActivity = Date.now();
    if (_sessionState.warningShown) hideWarning();
}

function handleVisibilityChange() {
    if (!document.hidden && _sessionState.active) checkSession();
}

function checkSession() {
    if (!_sessionState.active) return;
    const now = Date.now();
    const elapsed = now - _sessionState.lastActivity;
    const timeoutMs = SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000;
    const warningMs = timeoutMs - (SESSION_CONFIG.WARNING_BEFORE_SECONDS * 1000);
    if (elapsed >= timeoutMs) {
        destroySessionTimeout();
        _sessionState.onLogout();
        return;
    }
    if (elapsed >= warningMs && !_sessionState.warningShown) showWarning();
}

function createWarningElement() {
    if (_sessionState.warningElement) return;
    const el = document.createElement('div');
    el.id = 'sessionWarningOverlay';
    el.style.cssText = `display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;align-items:center;justify-content:center;padding:20px;`;
    el.innerHTML = `<div style="background:#111827;border:3px solid #fbbf24;border-radius:20px;padding:35px;max-width:450px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(251,191,36,0.4);font-family:'Segoe UI',Roboto,sans-serif;">
        <div style="font-size:3rem;margin-bottom:15px;">⏰</div>
        <h2 style="color:#fbbf24;font-size:1.5rem;margin-bottom:15px;">Session Expiring!</h2>
        <p style="color:#cbd5e1;margin-bottom:10px;font-size:0.95rem;line-height:1.6;">Aap <strong style="color:#fbbf24;">30 minutes</strong> se inactive hain.</p>
        <p style="color:#cbd5e1;margin-bottom:25px;font-size:0.95rem;line-height:1.6;"><strong id="sessionCountdown" style="color:#ef4444;font-size:1.3rem;">60</strong> seconds mein logout ho jayenge.</p>
        <button id="sessionExtendBtn" style="background:linear-gradient(135deg,#10b981,#059669);color:white;padding:14px 35px;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;margin-right:10px;">✓ Stay Logged In</button>
        <button id="sessionLogoutBtn" style="background:#ef4444;color:white;padding:14px 35px;border:none;border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer;">Logout Now</button>
    </div>`;
    document.body.appendChild(el);
    document.getElementById('sessionExtendBtn').addEventListener('click', handleUserActivity);
    document.getElementById('sessionLogoutBtn').addEventListener('click', function() {
        destroySessionTimeout();
        _sessionState.onLogout();
    });
    _sessionState.warningElement = el;
}

function showWarning() {
    if (!_sessionState.warningElement) return;
    _sessionState.warningShown = true;
    const el = _sessionState.warningElement;
    el.style.display = 'flex';
    let secondsLeft = SESSION_CONFIG.WARNING_BEFORE_SECONDS;
    const countdownEl = document.getElementById('sessionCountdown');
    if (countdownEl) countdownEl.innerText = secondsLeft;
    _sessionState.warningTimer = setInterval(() => {
        secondsLeft--;
        if (countdownEl) countdownEl.innerText = secondsLeft;
        if (secondsLeft <= 0) clearInterval(_sessionState.warningTimer);
    }, 1000);
}

function hideWarning() {
    if (!_sessionState.warningElement) return;
    _sessionState.warningElement.style.display = 'none';
    _sessionState.warningShown = false;
    if (_sessionState.warningTimer) {
        clearInterval(_sessionState.warningTimer);
        _sessionState.warningTimer = null;
    }
}

function destroySessionTimeout() {
    _sessionState.active = false;
    if (_sessionState.intervalTimer) clearInterval(_sessionState.intervalTimer);
    if (_sessionState.warningTimer) clearInterval(_sessionState.warningTimer);
    SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
    });
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (_sessionState.warningElement) {
        _sessionState.warningElement.remove();
        _sessionState.warningElement = null;
    }
}

function extendSession() { handleUserActivity(); }

console.log('✅ Session timeout system loaded');

// ============================================================
// END OF FILE (supabase-config.js v3)
// ============================================================