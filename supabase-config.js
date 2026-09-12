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

// ✅ NEW: Alias with default (same as getSetting)
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
// HELPER FUNCTIONS — Visits (NEW)
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
// HELPER FUNCTIONS — Daily Stats (NEW)
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
// HELPER FUNCTIONS — Signals (NEW)
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
// HELPER FUNCTIONS — Clients Count (NEW)
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
// HELPER FUNCTIONS — Trades (NEW — for stats recalculation)
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
console.log('✅ supabase-config.js loaded — v2 (with stats/visits/signals helpers)');