// ============================================================
// NexiXaupo — Supabase Client Configuration
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
// HELPER FUNCTIONS — aage kaam aayenge
// ============================================================

// Email se user dhoondein
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

// Secret key se user dhoondein
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

// Naya user banayein
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

// Naya payment banayein
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

// Saare users laayein (admin ke liye)
async function getAllUsers() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllUsers error:', error); return []; }
    return data || [];
}

// Saare payments laayein (admin ke liye)
async function getAllPayments() {
    const sb = initSupabase();
    const { data, error } = await sb
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) { console.error('getAllPayments error:', error); return []; }
    return data || [];
}

console.log('✅ supabase-config.js loaded');S