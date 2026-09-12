# Nexi Rocket-XauPo

Expert gold (XAUUSD) trading signals service — client verification + subscription system.

**Live:** https://nexixaupo.vercel.app  
**Domain:** nexifynova.co.uk

---

## 🗂️ Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Landing + Welcome overlay + Live demo + Real stats + Upcoming signals + Top & Footer disclaimers |
| `register.html` | 4-step registration (Supabase) + Password eye icons |
| `signin.html` | Login (Supabase) + Password eye icon + Risk disclaimer |
| `dashboard.html` | Client dashboard — Expert Trading Signals + Real stats + Manual trades + Disclaimer |
| `admin.html` | Admin panel — Payments, Users, Alerts, Banners, Settings |
| `trading-room.html` | Admin — S/R Settings + Signals Manager + Manual Trade Entry |
| `statistics-room.html` | Admin — Win Rate + Visitors + Clients analytics + Display Toggles |
| `renewal.html` | Subscription renewal (Supabase) |
| `supabase-config.js` | Supabase client + helpers (v2 with stats/visits/signals) |
| `vercel.json` | Clean URLs + rewrites |
| `README.md` | Documentation |

---

## ⚙️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend (SMTP — noreply@nexifynova.co.uk)
- **Hosting:** Vercel
- **DNS/Email Routing:** Cloudflare

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Clients (id, name, email, phone, password_hash, secret_key, capital, subscription_start, subscription_end, status) |
| `payments` | Payment proofs + verification |
| `trades` | Trade history (with `product` + `is_manual` columns) |
| `admin_logs` | Admin action audit |
| `settings` | Site-wide settings (18 rows including show_win_rate, show_visitors, show_clients) |
| `alerts` | Client/demo alert messages |
| `alert_templates` | Reusable alert templates |
| `banner_templates` | Reusable banner templates |
| `publicity_banners` | Publicity banners |
| `signals` | Upcoming trade signals (with `target` = demo/clients/both) |
| `visits` | Page visit tracking (with `visited_date`, `ip_address`) |
| `daily_stats` | Daily win rate + visits + clients stats (with `stat_date` UNIQUE) |

---

## 🔐 Admin Access

**URLs:**
- `/admin` — Main admin panel
- `/trading-room` — S/R + Signals + Manual Trades
- `/statistics-room` — Win Rate + Visitors + Clients analytics

**Credentials:** `admin` / `nexi2026`

---

## 💰 Business Model

- **First month:** $3
- **Renewal:** $5/month
- **Payment:** Binance Pay (UID: 968525536, Nickname: NexiProduct)

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Background | `#0a0e17` |
| Card BG | `#111827` |
| Deep BG | `#0f1729` |
| Gold Accent | `#d4af37` |
| Green | `#10b981` |
| Red | `#ef4444` |
| Blue | `#60a5fa` |
| Border | `#334155` |
| Text Muted | `#94a3b8` |

**Font:** 'Segoe UI', Roboto  
**Icons:** FontAwesome 6.0.0 CDN

**Favicon:**  
`https://i.ibb.co/Q3P4njkz/Chat-GPT-Image-Sep-1-2026-10-26-24-AM.png`

---

## ✅ Completed Phases

### Phase A — Legal & Trust
- Wording: "Expert Analysis + AI Precision" (no fake AI claims)
- Fake stats removed (1,247 / 68% / $42K+)
- Real Performance section (settings-conditional)
- Upcoming Signals section (signals table)
- Risk Disclaimer footer (index, dashboard, signin)
- Top Disclaimer strip (index, hero ke neeche)
- Favicon on all pages
- Visit tracking

### Phase A.2 — Visitors & Fixes
- Visitors counter with **1000 floor** + auto-increment animation
- Alert bubble z-index fix (10000)
- Display toggles (show_win_rate, show_visitors, show_clients) functional

### Step 6 — Trading Room
- S/R Settings (admin → clients)
- Signals Manager (waiting → HIT)
- Manual Trade Entry
- Manual trades displayed on client dashboard (with MANUAL badge)

### Statistics Room
- Overview cards (Win Rate / Trades / Visits / Clients)
- Win Rate table (date-wise, last 30 days)
- Visitors table (date-wise)
- Clients table (date-wise with cumulative)
- Display Toggles (ON/OFF for client-facing stats)
- "Recalculate Today" button

### Priority 5 — Password & Cleanup
- Password eye icons (👁️) on register + signin
- Signin risk disclaimer (form ke bahar visible)
- Favicons on all pages
- Wording updates (removed "AI Robot", "AI-Powered")

### supabase-config.js v2
- New helpers: `logVisit`, `getTodayVisits`, `getVisitsGroupedByDate`
- New helpers: `getDailyStats`, `saveDailyStats`, `getOverallWinRate`
- New helpers: `getActiveSignals`, `getAllSignals`, `getTotalSignalsCount`
- New helpers: `getActiveClientsCount`, `getTotalClientsCount`
- New helpers: `getTradesBetween`, `getSettingWithDefault`

---

## ⏳ Pending Phases

### Phase B — Security (NEXT SESSION)
- Supabase RLS enable
- Supabase Auth (replace custom auth)
- Email verification
- Rate limiting
- Payment server-side verification (Edge Function)
- Session timeout 30 min
- CSP, HSTS, X-Frame-Options (vercel.json)
- CORS setup

### Phase C — Infrastructure
- Environment variables
- Security headers
- CORS

### Steps 7-13
- Step 7: Trade Time AM/PM
- Step 8: Admin Search Engine
- Step 9: Password Visible (Admin)
- Step 10: Password Reset + Secret Key Login
- Step 11: Email Notifications (Resend SMTP)
- Step 12: Contact Us Form
- Step 13: Admin Contact Messages Panel

---

## 🚀 Deployment

Vercel pe auto-deploy on `git push` to `main` branch.

---

## 📝 Author

Asad Ilyas — inexifynova.solutions@gmail.com

---

## ⚠️ Known Security Debt

- RLS policies abhi permissive hain (Phase 1 setup)
- **Phase B mein Supabase Auth laga kar RLS tighten karna zaroori hai**
- Abhi custom auth (email + password_hash) use ho raha hai
- Credentials encrypted password manager mein rakhein — repo mein commit na karein